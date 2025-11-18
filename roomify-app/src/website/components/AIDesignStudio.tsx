import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Upload,
  Sparkles,
  ArrowRight,
  Palette,
  Image as ImageIcon,
  Shuffle,
  Wand2,
  Armchair,
  Bath,
  UtensilsCrossed,
  Sofa,
  BedDouble,
  Home,
  Download
} from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";

/* Dummy Before/After */
const beforeAfter = [
  {
    before:
      "https://images.unsplash.com/photo-1630699144919-681cf308ae82?auto=format&fit=crop&q=80&w=2070",
    after:
      "https://images.unsplash.com/photo-1630699144035-c0f6311ec482?auto=format&fit=crop&q=80&w=2070",
  },
];

export function AIDesignStudio() {
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [selectedRoomType, setSelectedRoomType] = useState("living");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  /* Scroll-reactive glow layer */
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const f = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  /* Choices */
  const roomTypes = [
    { id: "living", name: "Living Room", icon: Sofa },
    { id: "bedroom", name: "Bedroom", icon: BedDouble },
    { id: "kitchen", name: "Kitchen", icon: UtensilsCrossed },
    { id: "bathroom", name: "Bathroom", icon: Bath },
    { id: "dining", name: "Dining Room", icon: Armchair },
    { id: "office", name: "Office", icon: Home },
  ];

  const styles = [
    { id: "modern", name: "Modern Minimalist", image: "https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?w=1080&q=80" },
    { id: "scandinavian", name: "Scandinavian", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1080&q=80" },
    { id: "industrial", name: "Industrial Chic", image: "https://images.unsplash.com/photo-1680209668065-26985bc92268?w=1080&q=80" },
    { id: "coastal", name: "Coastal Breeze", image: "https://images.unsplash.com/photo-1760067537391-cd60b1ebc597?w=1080&q=80" },
    { id: "bohemian", name: "Bohemian", image: "https://images.unsplash.com/photo-1600493867499-4882d15a30ad?w=1080&q=80" },
    { id: "traditional", name: "Traditional", image: "https://images.unsplash.com/photo-1732971941082-c8f30eda7e07?w=1080&q=80" }
  ];

  const handleGenerate = () => {
    if (!imageFile) return alert("Upload a photo first!");
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentImage((prev) => (prev + 1) % beforeAfter.length);
    }, 2500);
  };

  const handleRandomStyle = () => {
    const index = Math.floor(Math.random() * styles.length);
    setSelectedStyle(styles[index].id);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUploadToFirebase = async () => {
    if (!user) return alert("Log in first.");
    if (!imageFile) return alert("Choose a photo.");

    try {
      setUploading(true);
      const fileName = `uploads/${user.uid}_${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "uploads"), {
        userId: user.uid,
        imageUrl: url,
        roomType: selectedRoomType,
        style: selectedStyle,
        public: true,
        createdAt: serverTimestamp(),
      });

      alert("Uploaded to your pins!");
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  /* ============================================================
        *****   RETURN — FULL PAGE WITH CINEMATIC BACKGROUND   *****
     ============================================================ */
  return (
    <div className="relative min-h-screen w-full overflow-hidden px-4 md:px-10 py-12 bg-[#130826]">

      {/* ⭐ CENTER GLOW (moves with scroll) */}
      <motion.div
        style={{ y: scrollY * -0.15 }}
        className="
          absolute top-[0px] left-1/2 -translate-x-1/2
          w-[1100px] h-[1100px]
          rounded-full
          bg-[#6c3ffb]/25
          blur-[230px]
          pointer-events-none
        "
      />

      {/* ⭐ TOP PURPLE AMBIENT GRADIENT */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-b
          from-[#351c79]/40
          via-transparent
          to-transparent
          pointer-events-none
        "
      />

      {/* ⭐ LEFT VIGNETTE */}
      <div
        className="
          absolute left-0 top-0 h-full w-[35%]
          bg-gradient-to-r from-black/40 to-transparent
          pointer-events-none
        "
      />

      {/* ⭐ RIGHT VIGNETTE */}
      <div
        className="
          absolute right-0 top-0 h-full w-[35%]
          bg-gradient-to-l from-black/40 to-transparent
          pointer-events-none
        "
      />

      {/* ⭐ BOTTOM PURPLE GLOW */}
      <motion.div
        style={{ y: scrollY * 0.08 }}
        className="
          absolute bottom-[-300px] left-1/2 -translate-x-1/2
          w-[900px] h-[900px]
          bg-[#6c3ffb]/20
          rounded-full blur-[180px]
          pointer-events-none
        "
      />

      {/* ⭐ MAIN CONTENT (unchanged) */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 shadow-lg">
            <Sparkles className="w-4 h-4" /> Powered by Advanced AI
          </div>

          <h1 className="text-5xl font-bold leading-[1.15] tracking-tight bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            Reimagine Your Space
          </h1>

          <p className="mt-4 text-purple-300/70 text-lg max-w-xl mx-auto">
            Transform any room into your dream interior with our cutting-edge AI.
          </p>
        </motion.div>

        {/* ================= UPLOAD FIRST ================= */}
        <div className="bg-gradient-to-b from-purple-900/40 to-blue-900/20 rounded-3xl border border-purple-500/20 backdrop-blur-xl p-6 shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl mb-4">
              <Upload className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl text-white mb-1">Upload Your Space</h3>
            <p className="text-purple-300 mb-4">Drag & drop or choose your room image (JPG / PNG / WebP)</p>

            <div className="flex justify-center">
              <label className="cursor-pointer w-full md:w-1/2">
                <input type="file" className="hidden" onChange={handleFileSelect} />
                <div className="w-full py-4 text-center text-white text-lg rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/40 hover:scale-[1.02] transition-transform">
                  Browse Files
                </div>
              </label>
            </div>

            {imageFile && <p className="mt-3 text-purple-200 text-sm">Selected: {imageFile.name}</p>}
          </div>
        </div>

        {/* ================= 2-COLUMN CONTROLS ================= */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* ROOM TYPE */}
          <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/40 p-6 rounded-3xl border border-blue-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-6 h-6 text-blue-300" />
              <h3 className="text-xl text-white">Room Type</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {roomTypes.map((room) => {
                const Icon = room.icon;
                const active = selectedRoomType === room.id;

                return (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomType(room.id)}
                    className={`rounded-2xl p-5 border transition-all ${
                      active ? "bg-purple-900/40 border-purple-400 shadow-lg" : "bg-slate-900/40 border-purple-600/20 hover:border-purple-300/40"
                    }`}
                  >
                    <Icon className={`mx-auto mb-2 w-8 h-8 ${active ? "text-white" : "text-purple-300"}`} />
                    <p className={`text-sm ${active ? "text-white" : "text-purple-300"}`}>{room.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESIGN STYLE */}
          <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/40 p-6 rounded-3xl border border-purple-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-purple-300" />
              <h3 className="text-xl text-white">Design Style</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {styles.map((style) => {
                const active = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`rounded-2xl overflow-hidden border transition-all ${
                      active ? "border-purple-300 scale-[1.03] shadow-lg" : "border-purple-400/20 hover:border-purple-300/40"
                    }`}
                  >
                    <div className="relative">
                      <img src={style.image} className="w-full h-24 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-white text-sm">{style.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= GENERATE BUTTON ================= */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-5 text-xl text-white rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-3"
        >
          {isGenerating ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Sparkles className="w-6 h-6" />
              </motion.div>
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-6 h-6" />
              Generate AI Design
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 gap-6">
          <button className="py-3 rounded-xl bg-purple-900/40 border border-purple-400/20 text-purple-200 flex items-center justify-center gap-2 hover:bg-purple-800/40 transition">
            <ImageIcon className="w-5 h-5" /> Use Examples
          </button>

          <button
            onClick={handleRandomStyle}
            className="py-3 rounded-xl bg-purple-900/40 border border-purple-400/20 text-purple-200 flex items-center justify-center gap-2 hover:bg-purple-800/40 transition"
          >
            <Shuffle className="w-5 h-5" /> Random Style
          </button>
        </div>

        {/* ================= TRANSFORMATION SECTION ================= */}
        <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 p-6 rounded-3xl border border-purple-500/20 shadow-2xl">
          <h3 className="text-2xl text-white mb-4">Transformation</h3>

          <div className="grid md:grid-cols-2 gap-6">

            {/* BEFORE */}
            <div>
              <p className="text-purple-300 text-sm mb-2">• Before</p>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-purple-500/20">
                <motion.img key={`before-${currentImage}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-64 object-cover" src={beforeAfter[currentImage].before} />
              </div>
            </div>

            {/* AFTER */}
            <div>
              <p className="text-purple-300 text-sm mb-2">• After</p>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-purple-500/20">
                <motion.img key={`after-${currentImage}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-64 object-cover" src={beforeAfter[currentImage].after} />

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-xl">
                      <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}
          {isGenerating && (
            <div className="mt-4">
              <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }} className="h-full bg-gradient-to-r from-purple-500 to-blue-500" />
              </div>
              <p className="mt-2 text-center text-purple-300 text-sm">AI is analyzing and redesigning your room...</p>
            </div>
          )}
        </div>

        {/* ================= FOOTER ACTIONS ================= */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-6">

          <button className="flex-1 py-4 text-center text-white text-lg rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Save Image
          </button>

          <button onClick={() => setImageFile(null)} className="flex-1 py-4 text-center text-white text-lg rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" /> Upload New Photo
          </button>

        </div>

      </div>
    </div>
  );
}
