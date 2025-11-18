import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Trash2, Wand2 } from "lucide-react";
import { deleteDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { likeImage, unlikeImage } from "../utils/likeUtils";

interface ImageDetailPageProps {
  image: any;               // Firestore doc object
  onBack: () => void;       // go back to explore / profile
}

export function ImageDetailPage({ image, onBack }: ImageDetailPageProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  const isMine = user?.uid === image.userId;

  // Check if user has liked this image
  useEffect(() => {
    if (!user) {
      setIsLiked(false);
      return;
    }

    const likesRef = collection(db, "users", user.uid, "likes");
    const unsubscribe = onSnapshot(likesRef, (snapshot) => {
      const liked = snapshot.docs.some(doc => doc.id === image.id);
      setIsLiked(liked);
    });

    return () => unsubscribe();
  }, [user, image.id]);

  // dummy "after" image (just to fill space)
  const placeholderAfter =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

  const handleToggleLike = async () => {
    if (!user) {
      alert("Please log in to like images!");
      return;
    }

    try {
      if (isLiked) {
        await unlikeImage(user.uid, image.id);
      } else {
        await likeImage(user.uid, image);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      alert("Failed to update favorite status.");
    }
  };

  const handleRestyle = () => {
    alert("🎨 Demo mode: In production, this would let you regenerate this room design with a different style using AI!");
  };

  const handleDelete = async () => {
    if (!isMine) return;

    const confirmed = window.confirm("Are you sure you want to delete this image?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "uploads", image.id));
      alert("Deleted.");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="py-24 px-8 min-h-screen max-w-5xl mx-auto">

      {/* BACK BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center gap-2 mb-10 text-black/70 hover:text-black transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </motion.button>

      {/* TITLE */}
      <h1 className="text-4xl font-semibold mb-8">
        {image.style} • {image.roomType}
      </h1>

      {/* BEFORE / AFTER GRID */}
      <div className="grid md:grid-cols-2 gap-10 mb-12">
        
        {/* BEFORE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <p className="text-black/50 mb-3">Original Upload</p>
          <div className="rounded-2xl overflow-hidden">
            <img
              src={image.imageUrl}
              alt="Before"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </motion.div>

        {/* AFTER (placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <p className="text-black/50 mb-3">AI Restyle Preview</p>
          <div className="rounded-2xl overflow-hidden relative">
            <img
              src={placeholderAfter}
              alt="After"
              className="w-full h-[400px] object-cover"
            />

            {/* Overlay label */}
            <div className="absolute bottom-3 right-3 bg-black/60 px-3 py-1.5 rounded-lg text-xs text-white">
              Placeholder Preview
            </div>
          </div>
        </motion.div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-4 flex-wrap">

        {/* Favorite */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleLike}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow border transition-all ${
            isLiked
              ? 'bg-red-50 border-red-200'
              : 'bg-white border-black/10 hover:bg-black/5'
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-[#c97b63]'
            }`}
          />
          <span>{isLiked ? 'Favorited' : 'Favorite'}</span>
        </motion.button>

        {/* Restyle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRestyle}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c97b63] text-white shadow"
        >
          <Wand2 className="w-5 h-5" />
          <span>Re-Style</span>
        </motion.button>

        {/* Delete if it's the user's image */}
        {isMine && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}