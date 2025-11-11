import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Heart, Bookmark, Clock, Award, TrendingUp, Edit, X, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";

// 🧩 Dummy user & interior photos (Unsplash)
const profilePic =
  "https://wallpapers.com/images/high/matching-anime-profile-pictures-923-x-948-o86k3jsdjhgtdvp5.webp";

const myDesigns = [
  {
    image:
      "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2128",
    title: "Modern Living Room",
    date: "Oct 15, 2025",
    likes: 234,
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2940",
    title: "Cozy Bedroom",
    date: "Oct 12, 2025",
    likes: 189,
  },
  {
    image:
      "https://images.unsplash.com/photo-1704428381387-3b457403131d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2069",
    title: "Contemporary Kitchen",
    date: "Oct 8, 2025",
    likes: 312,
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1676823570969-da7d0074804d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    title: "Rustic Dining",
    date: "Oct 5, 2025",
    likes: 167,
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2874",
    title: "Spa Bathroom",
    date: "Oct 1, 2025",
    likes: 445,
  },
  {
    image:
      "https://images.unsplash.com/photo-1747336754870-ca7b10cc75f5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2946",
    title: "Bohemian Space",
    date: "Sep 28, 2025",
    likes: 298,
  },
];

export function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("designs");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || "");
  const [editBio, setEditBio] = useState("Passionate interior designer with over 10 years of experience");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await updateProfile(user, {
        displayName: editName,
      });
      alert('Profile updated successfully!');
      setIsEditModalOpen(false);
    } catch (error: any) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "designs", label: "My Designs", icon: Clock, count: 24 },
    { id: "liked", label: "Liked", icon: Heart, count: 156 },
    { id: "saved", label: "Saved", icon: Bookmark, count: 89 },
  ];

  return (
    <div className="py-24 px-8 min-h-screen bg-[#f5f0ea]">
      <div className="mx-auto">
        {/* ===== Profile Header ===== */}
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
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white text-[#c97b63] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
              </motion.div>

              <div>
                <h1 className="text-4xl mb-2 font-semibold">{user?.displayName || user?.email || 'Guest'}</h1>
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
              { label: "Designs Created", value: "324" },
              { label: "Total Likes", value: "12.5K" },
              { label: "Followers", value: "8.2K" },
              { label: "Following", value: "432" },
              { label: "Avg. Rating", value: "4.9" },
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

        {/* ===== About Section ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 mb-8 shadow-lg"
        >
          <h2 className="text-2xl mb-4 font-semibold">About Me</h2>
          <p className="text-black/70 leading-relaxed mb-4">
            Passionate interior designer with over 10 years of experience creating beautiful,
            functional spaces. Specializing in modern minimalism with a touch of Japanese aesthetics.
            I believe in the power of simplicity and the importance of creating spaces that enhance
            well-being.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-black/60">Specialties:</span>
            {[
              "Modern Minimalism",
              "Scandinavian",
              "Japanese Zen",
              "Sustainable Design",
            ].map((specialty) => (
              <span
                key={specialty}
                className="bg-[#c97b63]/10 text-[#c97b63] px-3 py-1 rounded-lg text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ===== Tabs ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
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

        {/* ===== My Designs Grid ===== */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myDesigns.map((design, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={design.image}
                  alt={design.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{design.likes}</span>
                    </div>
                    <span className="text-sm text-white/80">{design.date}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2 group-hover:text-[#c97b63] transition-colors">
                  {design.title}
                </h3>
                <p className="text-sm text-black/60">{design.date}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== Edit Profile Modal ===== */}
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
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border-2 border-black/10 bg-black/5 text-black/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-black/50 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#c97b63] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#b86b53] transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      'Saving...'
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
