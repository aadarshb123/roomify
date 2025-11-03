import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, MessageCircle, ThumbsUp, Share2, Filter, } from "lucide-react";

export function CommunityShowcase() {
  const [filter, setFilter] = useState("all");

  // 🧩 Dummy posts with Unsplash interiors
  const posts = [
    {
      user: "Emma Wilson",
      avatar: "👩‍🎨",
      time: "2 hours ago",
      text: "Just finished this cozy bedroom redesign! What do you think?",
      image:
        "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2128",
      likes: 234,
      comments: 45,
      category: "bedroom",
    },
    {
      user: "David Park",
      avatar: "👨‍💼",
      time: "5 hours ago",
      text: "Modern kitchen transformation using AI. The results are amazing!",
      image:
        "https://images.unsplash.com/photo-1704428381387-3b457403131d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2069",
      likes: 189,
      comments: 32,
      category: "kitchen",
    },
    {
      user: "Sophie Laurent",
      avatar: "👩‍🔬",
      time: "1 day ago",
      text: "Scandinavian living room vibes ✨",
      image:
        "https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2940",
      likes: 567,
      comments: 78,
      category: "living",
    },
    {
      user: "Alex Martinez",
      avatar: "👨‍🎨",
      time: "1 day ago",
      text: "Industrial style dining area - loving these textures!",
      image:
        "https://plus.unsplash.com/premium_photo-1676823570969-da7d0074804d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
      likes: 421,
      comments: 56,
      category: "dining",
    },
    {
      user: "Lily Chen",
      avatar: "👩‍💻",
      time: "2 days ago",
      text: "Spa-like bathroom achieved with AI assistance 🛁",
      image:
        "https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2874",
      likes: 312,
      comments: 41,
      category: "bathroom",
    },
    {
      user: "Marcus Johnson",
      avatar: "👨‍🏫",
      time: "2 days ago",
      text: "Bohemian dream space complete! Thanks to the community for inspiration.",
      image:
        "https://images.unsplash.com/photo-1747336754870-ca7b10cc75f5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2946",
      likes: 445,
      comments: 63,
      category: "living",
    },
  ];

  const filters = [
    { id: "all", label: "All Posts" },
    { id: "living", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "kitchen", label: "Kitchen" },
    { id: "bathroom", label: "Bathroom" },
    { id: "dining", label: "Dining" },
  ];

  const filteredPosts =
    filter === "all"
      ? posts
      : posts.filter((post) => post.category === filter);

  return (
    <div className="py-24 px-8 bg-[#eae5e0]">
      <div className="max-w-7xl mx-auto">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#c97b63]/10 px-4 py-2 rounded-full mb-6">
            <Users className="w-4 h-4 text-[#c97b63]" />
            <span className="text-sm text-[#c97b63]">Community Feed</span>
          </div>
          <h2 className="text-5xl mb-4 font-semibold">
            What Our Community Creates
          </h2>
          <p className="text-xl text-black/60 max-w-2xl mx-auto">
            Get inspired by thousands of designers sharing their AI-powered
            transformations
          </p>
        </motion.div>

        {/* ===== Filters ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-12 flex-wrap"
        >
          <div className="flex items-center gap-2 text-black/60">
            <Filter className="w-5 h-5" />
            <span>Filter:</span>
          </div>
          {filters.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f.id
                  ? "bg-[#c97b63] text-white shadow-lg"
                  : "bg-white/50 text-black/70 hover:bg-white"
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* ===== Posts Grid ===== */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.user + post.time}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-[#c97b63] to-[#d4956f] rounded-full flex items-center justify-center text-xl">
                      {post.avatar}
                    </div>
                    <div>
                      <p className="text-sm">{post.user}</p>
                      <p className="text-xs text-black/50">{post.time}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-black/50 hover:text-black"
                  >
                    •••
                  </motion.button>
                </div>

                {/* Post Text */}
                <div className="px-4 pb-3">
                  <p className="text-sm text-black/70">{post.text}</p>
                </div>

                {/* Post Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt={post.text}
                    className="w-full h-64 object-cover"
                  />
                </motion.div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 text-black/60 hover:text-[#c97b63] transition-colors"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm">{post.likes}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 text-black/60 hover:text-[#c97b63] transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-black/60 hover:text-[#c97b63] transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 bg-[#f5f0ea] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c97b63]/30"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-[#c97b63] text-sm"
                    >
                      Post
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ===== Join CTA ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-linear-to-r from-[#c97b63] to-[#d4956f] rounded-3xl p-12 text-center text-white"
        >
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-4xl mb-4 font-semibold">
            Join Our Creative Community
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with 25,000+ designers, share your work, and get inspired
            daily
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#c97b63] px-8 py-4 rounded-xl shadow-lg"
            >
              Create Free Account
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl border border-white/30"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
