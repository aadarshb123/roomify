import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Upload,
  Sparkles,
  ArrowRight,
  Palette,
  Image,
  Shuffle,
  Wand2,
  Armchair,
  Bath,
  UtensilsCrossed,
  Sofa,
  BedDouble,
  Home,
} from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

// 🧩 Dummy interior images (before & after simulation)
const beforeAfter = [
  {
    before:
      "https://images.unsplash.com/photo-1630699144919-681cf308ae82?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    after:
      "https://images.unsplash.com/photo-1630699144035-c0f6311ec482?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
  },
];

export function AIDesignStudio() {
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedRoomType, setSelectedRoomType] = useState('living');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);


  const roomTypes = [
    { id: 'living', name: 'Living Room', icon: Sofa },
    { id: 'bedroom', name: 'Bedroom', icon: BedDouble },
    { id: 'kitchen', name: 'Kitchen', icon: UtensilsCrossed },
    { id: 'bathroom', name: 'Bathroom', icon: Bath },
    { id: 'dining', name: 'Dining Room', icon: Armchair },
    { id: 'office', name: 'Office', icon: Home },
  ];

  const styles = [
    { 
      id: 'modern', 
      name: 'Modern Minimalist', 
      image: 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYyMDk0Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      id: 'scandinavian', 
      name: 'Scandinavian', 
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjIwNjg4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      id: 'industrial', 
      name: 'Industrial Chic', 
      image: 'https://images.unsplash.com/photo-1680209668065-26985bc92268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwY2hpYyUyMGludGVyaW9yfGVufDF8fHx8MTc2MjE0NzUxMHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      id: 'coastal', 
      name: 'Coastal Breeze', 
      image: 'https://images.unsplash.com/photo-1760067537391-cd60b1ebc597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwYmVhY2glMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIxMjU0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      id: 'bohemian', 
      name: 'Bohemian', 
      image: 'https://images.unsplash.com/photo-1600493867499-4882d15a30ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hlbWlhbiUyMGludGVyaW9yJTIwZGVjb3J8ZW58MXx8fHwxNzYyMTQ3NTExfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      id: 'traditional', 
      name: 'Traditional', 
      image: 'https://images.unsplash.com/photo-1732971941082-c8f30eda7e07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNsYXNzaWMlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIxNDc1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentImage((prev) => (prev + 1) % beforeAfter.length);
    }, 3000);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleUploadToFirebase = async () => {
    if (!user) {
      alert('Please log in before uploading.');
      return;
    }

    if (!imageFile) {
      alert('Please choose a photo first.');
      return;
    }

    try {
      setUploading(true);
      const fileName = `uploads/${user.uid}_${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'uploads'), {
        userId: user.uid,
        imageUrl,
        roomType: selectedRoomType,
        style: selectedStyle,
        createdAt: serverTimestamp(),
      });

      alert('Upload successful! Your room has been added.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="py-24 px-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-[#c97b63]/10 px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-[#c97b63]" />
          <span className="text-sm text-[#c97b63]">AI Design Studio</span>
        </div>
        <h2 className="text-5xl mb-4">Try Our AI Designer</h2>
        <p className="text-xl text-black/60 max-w-2xl mx-auto">
          Upload your room photo and watch as our AI transforms it into your dream space
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Upload Area */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed border-[#c97b63]/30">
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-20 h-20 bg-linear-to-br from-[#c97b63] to-[#d4956f] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Upload className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl mb-2">Upload Your Room</h3>
              <p className="text-black/60 mb-6">
                Drag & drop your photo or click to browse
              </p>
              <div className="relative inline-block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#c97b63] text-white px-8 py-3 rounded-xl"
                  onClick={() => document.getElementById('fileInput')?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Choose Photo'}
                </motion.button>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {imageFile && (
                <p className="text-sm mt-2 text-black/70">
                  Selected: <span className="font-medium">{imageFile.name}</span>
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadToFirebase}
                disabled={uploading}
                className="mt-4 bg-[#c97b63]/80 hover:bg-[#c97b63] text-white px-8 py-3 rounded-xl"
              >
                {uploading ? 'Uploading...' : 'Save to My Pins'}
              </motion.button>
            </div>
          </div>

          {/* Room Type Selection */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Home className="w-6 h-6 text-[#c97b63]" />
              <h3 className="text-xl">Select Room Type</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {roomTypes.map((room) => {
                const Icon = room.icon;
                return (
                  <motion.button
                    key={room.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedRoomType(room.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedRoomType === room.id
                        ? 'border-[#c97b63] bg-[#c97b63]/10 shadow-lg'
                        : 'border-black/10 bg-white/50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      selectedRoomType === room.id ? 'text-[#c97b63]' : 'text-black/60'
                    }`} />
                    <p className="text-xs">{room.name}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Style Selection */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-[#c97b63]" />
              <h3 className="text-xl">Choose Your Style</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {styles.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl border-2 transition-all overflow-hidden ${
                    selectedStyle === style.id
                      ? 'border-[#c97b63] bg-[#c97b63]/10 shadow-lg'
                      : 'border-black/10 bg-white/50'
                  }`}
                >
                  <div className="relative w-full h-16 rounded-lg mb-3 overflow-hidden">
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm">{style.name}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-linear-to-r from-[#c97b63] to-[#d4956f] text-white py-6 rounded-xl shadow-2xl flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                <span className="text-xl">Generating Magic...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                <span className="text-xl">Generate Design</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </motion.button>

          {/* Quick actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm py-3 rounded-xl border border-black/10"
            >
              <Image className="w-5 h-5" />
              <span>Example Photos</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm py-3 rounded-xl border border-black/10"
            >
              <Shuffle className="w-5 h-5" />
              <span>Random Style</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="sticky top-24"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Before & After</h3>
              <div className="flex items-center gap-2 bg-[#c97b63]/10 px-3 py-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-[#c97b63]" />
                <span className="text-sm text-[#c97b63]">AI Generated</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-black/60 mb-3">Before</p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-xl overflow-hidden shadow-xl"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`before-${currentImage}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      src={beforeAfter[currentImage].before}
                      alt="Before"
                      className="w-full h-80 object-cover"
                    />
                  </AnimatePresence>
                </motion.div>
              </div>

              <div>
                <p className="text-sm text-black/60 mb-3">After</p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-xl overflow-hidden shadow-xl"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`after-${currentImage}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      src={beforeAfter[currentImage].after}
                      alt="After"
                      className="w-full h-80 object-cover"
                    />
                  </AnimatePresence>

                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-[#c97b63]/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="w-12 h-12 text-white" />
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Progress bar */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="bg-black/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-full bg-linear-to-r from-[#c97b63] to-[#d4956f]"
                  />
                </div>
                <p className="text-sm text-center text-black/60 mt-2">
                  AI is analyzing your space and applying the design...
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}