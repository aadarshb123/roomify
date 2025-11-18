import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Heart,
  Bookmark,
  Clock,
  Award,
  TrendingUp,
  Edit,
  X,
  Save
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { db } from "../../config/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

const profilePic =
  "https://wallpapers.com/images/high/matching-anime-profile-pictures-923-x-948-o86k3jsdjhgtdvp5.webp";

export function ProfilePage({ setCurrentSection, setSelectedImage }: any) {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("designs");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || "");
  const [editBio, setEditBio] = useState(
    "Passionate interior designer with over 10 years of experience"
  );
  const [saving, setSaving] = useState(false);

  // ===== NEW STATE FOR REAL IMAGES =====
  const [myUploads, setMyUploads] = useState<any[]>([]);
  const [myLikes, setMyLikes] = useState<any[]>([]);

  // ===== LOAD USER UPLOADS =====
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "uploads"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMyUploads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  // ===== LOAD USER LIKES =====
  useEffect(() => {
    if (!user) return;

    const likesRef = collection(db, "users", user.uid, "likes");

    const unsub = onSnapshot(likesRef, (snap) => {
      setMyLikes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: editName
      });
      
      // Update Firestore user document
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: editName,
          bio: editBio,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      
      alert("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (error: any) {
      alert("Error updating profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // ===== UPDATE TAB COUNTS =====
  const tabs = [
    { id: "designs", label: "My Designs", icon: Clock, count: myUploads.length },
    { id: "liked", label: "Liked", icon: Heart, count: myLikes.length },
    { id: "saved", label: "Saved", icon: Bookmark, count: 0 } // we don't support saved yet
  ];

  return (
    <div className="py-24 px-8 min-h-screen bg-[#f5f0ea]">
      <div className="mx-auto">

        {/* ===== PROFILE HEADER (UNCHANGED) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-[#c97b63] to-[#d4956f] rounded-3xl p-12 mb-12 text-white shadow-2xl"
        >
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="relative">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-white/30 shadow-xl"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => alert("📸 Demo mode: In production, this would allow you to upload a new profile picture!")}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white text-[#c97b63] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
              </motion.div>

              <div>
                <h1 className="text-4xl mb-2 font-semibold">
                  {user?.displayName || user?.email || "Guest"}
                </h1>
                <p className="text-white/90 mb-4">Interior Designer</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Verified Pro</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Top 1% Designer</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30"
            >
              <Settings className="w-5 h-5" />
              <span>Edit Profile</span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: "Designs Created", value: myUploads.length },
              { label: "Likes", value: myLikes.length },
              { label: "Followers", value: "8.2K" },
              { label: "Following", value: "432" },
              { label: "Rating", value: "4.9" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <p className="text-3xl mb-1">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== ABOUT SECTION (UNCHANGED) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 mb-8 shadow-lg"
        >
          <h2 className="text-2xl mb-4 font-semibold">About Me</h2>
          <p className="text-black/70 leading-relaxed mb-4">
            Passionate interior designer with over 10 years of experience creating beautiful,
            functional spaces. Specializing in modern minimalism with a touch of Japanese aesthetics.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-black/60">Specialties:</span>
            {["Modern Minimalism", "Scandinavian", "Japanese Zen", "Sustainable Design"].map(
              (s) => (
                <span key={s} className="bg-[#c97b63]/10 text-[#c97b63] px-3 py-1 rounded-lg text-sm">
                  {s}
                </span>
              )
            )}
          </div>
        </motion.div>

        {/* ===== TABS (UNCHANGED UI) ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex gap-3 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#c97b63] text-white shadow-lg"
                      : "bg-white text-black/70 hover:bg-white/80"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive ? "bg-white/20" : "bg-black/10"
                    }`}
                  >
                    {tab.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ===== GRID (REPLACED ONLY THIS SECTION) ===== */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeTab === "designs" ? myUploads : myLikes).map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
              onClick={() => {
                setSelectedImage(img);
                setCurrentSection("image-detail");
              }}
            >
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={img.imageUrl}
                  alt=""
                  className="w-full h-64 object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{/* optional like count */}</span>
                    </div>
                    <span className="text-sm text-white/80">
                      {/* we don't have Firestore date text but could format createdAt */}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl mb-2 group-hover:text-[#c97b63] transition-colors">
                  {img.roomType}
                </h3>
                <p className="text-sm text-black/60 capitalize">{img.style}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== EDIT PROFILE MODAL (UNCHANGED) ===== */}
        <AnimatePresence>
          {isEditModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditModalOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl z-50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-semibold">Edit Profile</h2>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* ===== FULL INPUT FORM (restored) ===== */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-black/70 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-black/10 focus:border-[#c97b63] outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black/70 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-black/10 focus:border-[#c97b63] outline-none transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black/70 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border-2 border-black/10 bg-black/5 text-black/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-black/50 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                {/* ===== SAVE/CANCEL BUTTONS ===== */}
                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#c97b63] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#b86b53] transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium border-2 border-black/10 hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
