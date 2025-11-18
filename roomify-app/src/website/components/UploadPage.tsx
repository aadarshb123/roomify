import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Home,
  Sofa,
  BedDouble,
  UtensilsCrossed,
  Bath,
  Armchair,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { storage, db } from "../../config/firebase";

export function UploadPage({ onUploaded }: { onUploaded?: () => void }) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState("living");
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [isPublic, setIsPublic] = useState(true);

  const roomTypes = [
    { id: "living", name: "Living Room", icon: Sofa },
    { id: "bedroom", name: "Bedroom", icon: BedDouble },
    { id: "kitchen", name: "Kitchen", icon: UtensilsCrossed },
    { id: "bathroom", name: "Bathroom", icon: Bath },
    { id: "dining", name: "Dining Room", icon: Armchair },
    { id: "office", name: "Office", icon: Home },
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    try {
      setUploading(true);

      const filePath = `uploads/${user.uid}_${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, filePath);

      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "uploads"), {
        userId: user.uid,
        imageUrl: url,
        roomType: selectedRoomType,
        style: selectedStyle,
        public: isPublic,
        description: description,
        createdAt: serverTimestamp(),
      });

      alert("Upload successful!");

      setImageFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="py-24 px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl mb-10 font-semibold text-center">Upload a Room</h1>

      {/* UPLOAD BOX */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-10">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#c97b63] flex items-center justify-center shadow-xl">
            <Upload className="w-10 h-10 text-white" />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="uploadInput"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById("uploadInput")?.click()}
            className="bg-[#c97b63] text-white px-8 py-3 rounded-xl"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Choose Photo"}
          </motion.button>

          {imageFile && (
            <p className="mt-3 text-black/70 text-sm">{imageFile.name}</p>
          )}
        </div>
      </div>

      {/* ROOM TYPE */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-10">
        <h3 className="text-xl mb-4 font-semibold">Room Type</h3>
        <div className="grid grid-cols-3 gap-4">
          {roomTypes.map((room) => {
            const Icon = room.icon;
            const active = selectedRoomType === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoomType(room.id)}
                className={`p-4 rounded-xl border-2 ${
                  active
                    ? "border-[#c97b63] bg-[#c97b63]/10"
                    : "border-black/10 bg-white"
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">{room.name}</p>
              </button>
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

          {/* PRIVACY TOGGLE */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-10 mt-10">
            <h3 className="text-xl mb-4 font-semibold">Visibility</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* PUBLIC OPTION */}
              <button
                onClick={() => setIsPublic(true)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                  ${isPublic 
                    ? "border-[#c97b63] bg-[#c97b63]/10 shadow-lg" 
                    : "border-black/10 bg-white"
                  }`}
              >
                <Eye className="w-6 h-6" />
                <p className="text-sm font-medium">Public</p>
                <p className="text-xs text-black/50">Anyone can see</p>
              </button>

              {/* PRIVATE OPTION */}
              <button
                onClick={() => setIsPublic(false)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                  ${!isPublic 
                    ? "border-[#c97b63] bg-[#c97b63]/10 shadow-lg" 
                    : "border-black/10 bg-white"
                  }`}
              >
                <EyeOff className="w-6 h-6" />
                <p className="text-sm font-medium">Private</p>
                <p className="text-xs text-black/50">Only you</p>
              </button>
            </div>
          </div>

        {/* DESCRIPTION BOX */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-10">
          <h3 className="text-xl mb-4 font-semibold">Description</h3>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="
              w-full 
              h-32 
              p-4 
              rounded-xl 
              border-2 
              border-black/10 
              focus:border-[#c97b63] 
              focus:ring-2 
              focus:ring-[#c97b63]/30 
              outline-none 
              resize-none
              text-sm
              bg-white
            "
          />
        </div>

      {/* SUBMIT */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          disabled={uploading}
          className="bg-[#c97b63] text-white px-10 py-4 rounded-xl shadow-lg"
        >
          {uploading ? "Uploading..." : "Save Room"}
        </motion.button>
      </div>
    </div>
  );
}