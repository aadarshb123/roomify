import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Filter } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { likeImage, unlikeImage } from "../utils/likeUtils";

interface ExplorePageProps {
  onSelectImage: (image: any) => void; // parent will open ImageDetailPage
}

export function ExplorePage({ onSelectImage }: ExplorePageProps) {
  const { user } = useAuth();

  const [images, setImages] = useState<any[]>([]);
  const [roomFilter, setRoomFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");

  const roomTypes = [
    { id: "all", label: "All Rooms" },
    { id: "living", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "kitchen", label: "Kitchen" },
    { id: "bathroom", label: "Bathroom" },
    { id: "dining", label: "Dining Room" },
    { id: "office", label: "Office" }
  ];

  const styleTypes = [
    { id: "all", label: "All Styles" },
    { id: "modern", label: "Modern" },
    { id: "scandinavian", label: "Scandinavian" },
    { id: "industrial", label: "Industrial" },
    { id: "coastal", label: "Coastal" },
    { id: "bohemian", label: "Bohemian" },
    { id: "traditional", label: "Traditional" }
  ];

  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // load user's liked images
  useEffect(() => {
    if (!user) return;

    const likesRef = collection(db, "users", user.uid, "likes");
    const unsubscribe = onSnapshot(likesRef, (snapshot) => {
      const map: Record<string, boolean> = {};
      snapshot.docs.forEach((doc) => {
        map[doc.id] = true;
      });
      setLikedMap(map);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const q = query(
      collection(db, "uploads"),
      where("public", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(list);
    });

    return () => unsubscribe();
  }, []);

  const filteredImages = images.filter((img) => {
    const roomMatch = roomFilter === "all" || img.roomType === roomFilter;
    const styleMatch = styleFilter === "all" || img.style === styleFilter;
    return roomMatch && styleMatch;
  });

  return (
    <div className="py-24 px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl mb-6 font-semibold">Explore Designs</h1>
          <p className="text-xl text-black/60">
            Browse public uploads from the Roomify community
          </p>
        </motion.div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-[#c97b63]" />
            <h3 className="text-xl font-medium">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ROOM FILTER */}
            <div>
              <p className="text-sm text-black/70 mb-2">Room Type</p>
              <div className="flex flex-wrap gap-3">
                {roomTypes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRoomFilter(r.id)}
                    className={`px-5 py-2 rounded-lg border-2 text-sm transition-all ${
                      roomFilter === r.id
                        ? "bg-[#c97b63] text-white border-[#c97b63]"
                        : "bg-white text-black/70 border-black/10 hover:bg-black/5"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* STYLE FILTER */}
            <div>
              <p className="text-sm text-black/70 mb-2">Style</p>
              <div className="flex flex-wrap gap-3">
                {styleTypes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyleFilter(s.id)}
                    className={`px-5 py-2 rounded-lg border-2 text-sm transition-all ${
                      styleFilter === s.id
                        ? "bg-[#c97b63] text-white border-[#c97b63]"
                        : "bg-white text-black/70 border-black/10 hover:bg-black/5"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS COUNT */}
        <p className="text-black/60 mb-6">
          Showing <span className="font-semibold text-black">{filteredImages.length}</span> results
        </p>

        {/* GRID */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              onClick={() => onSelectImage(img)}
            >
              <div className="relative">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={img.imageUrl}
                  alt="Room"
                  className="w-full h-64 object-cover"
                />

                {/* FAVORITE BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening detail page
                    if (!user) return alert("Please log in to like images.");

                    if (likedMap[img.id]) {
                      unlikeImage(user.uid, img.id);
                    } else {
                      likeImage(user.uid, img);
                    }
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      likedMap[img.id] ? "text-red-500 fill-red-500" : "text-[#c97b63]"
                    }`}
                  />
                </motion.button>

              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold capitalize mb-2">
                  {img.style} • {img.roomType}
                </h3>
                <p className="text-sm text-black/50">
                  Uploaded by {img.userId === user?.uid ? "you" : "user"}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}