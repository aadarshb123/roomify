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
    { id: "modern", name: "Modern Minimalist" },
    { id: "scandinavian", name: "Scandinavian" },
    { id: "industrial", name: "Industrial Chic" },
    { id: "coastal", name: "Coastal Breeze" },
    { id: "bohemian", name: "Bohemian" },
    { id: "traditional", name: "Traditional" },
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

      {/* STYLE */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-10">
        <h3 className="text-xl mb-4 font-semibold">Style</h3>
        <div className="grid grid-cols-2 gap-4">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-3 rounded-xl border-2 ${
                selectedStyle === style.id
                  ? "border-[#c97b63] bg-[#c97b63]/10"
                  : "border-black/10 bg-white"
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRIVACY TOGGLE */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-10">
        <h3 className="text-xl mb-4 font-semibold">Visibility</h3>

        <button
          onClick={() => setIsPublic(!isPublic)}
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-black/5 hover:bg-black/10 transition"
        >
          {isPublic ? (
            <>
              <Eye className="w-5 h-5 text-[#c97b63]" />
              <span>Public (anyone can see)</span>
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5 text-black/50" />
              <span>Private (only you)</span>
            </>
          )}
        </button>
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