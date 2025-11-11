import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, TrendingUp, Heart, } from "lucide-react";

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const trendingSearches = [
    "Modern Living Room",
    "Minimalist Bedroom",
    "Scandinavian Kitchen",
    "Bohemian Decor",
    "Industrial Style",
    "Coastal Design",
  ];

  const filters = [
    { id: "all", label: "All Rooms" },
    { id: "living", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "kitchen", label: "Kitchen" },
    { id: "bathroom", label: "Bathroom" },
    { id: "dining", label: "Dining Room" },
    { id: "office", label: "Office" },
  ];

  // 🧩 Dummy AI interior images (Unsplash)
  const searchResults = [
    {
      image:
        "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2128",
      title: "Modern Minimalist Living",
      designer: "Sarah Chen",
      category: "living",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2940",
      title: "Cozy Scandinavian Bedroom",
      designer: "Erik Nordström",
      category: "bedroom",
    },
    {
      image:
        "https://images.unsplash.com/photo-1704428381387-3b457403131d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2069",
      title: "Contemporary Kitchen Design",
      designer: "Maria Rodriguez",
      category: "kitchen",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1676823570969-da7d0074804d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
      title: "Rustic Dining Space",
      designer: "James Morrison",
      category: "dining",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2874",
      title: "Luxury Spa Bathroom",
      designer: "Isabella Costa",
      category: "bathroom",
    },
    {
      image:
        "https://images.unsplash.com/photo-1737305457553-d6427adfdc8f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
      title: "Modern Office Area",
      designer: "Luna Martinez",
      category: "office",
    },
  ];

  const filteredResults =
    selectedFilter === "all"
      ? searchResults
      : searchResults.filter((r) => r.category === selectedFilter);

  return (
    <div className="py-24 px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl mb-6 font-semibold">Discover Your Dream Design</h1>
          <p className="text-xl text-black/60 mb-8">
            Explore thousands of AI-generated interiors personalized for every style
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-black/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by style, room type, or designer..."
                className="w-full bg-white rounded-2xl pl-16 pr-6 py-5 text-lg outline-none focus:ring-4 focus:ring-[#c97b63]/30 shadow-xl"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-linear-to-r from-[#c97b63] to-[#d4956f] text-white px-8 py-3 rounded-xl shadow-md"
              >
                Search
              </motion.button>
            </div>
          </div>

          {/* Trending Searches */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <TrendingUp className="w-5 h-5 text-[#c97b63]" />
            <span className="text-sm text-black/60">Trending:</span>
            {trendingSearches.map((search) => (
              <motion.button
                key={search}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery(search)}
                className="text-sm bg-white px-3 py-1.5 rounded-lg hover:bg-[#c97b63] hover:text-white transition-colors"
              >
                {search}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ===== Filters ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-black/60" />
              <h3 className="text-xl font-medium">Filter Results</h3>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-xl transition-all ${
                  selectedFilter === filter.id
                    ? "bg-[#c97b63] text-white shadow-lg"
                    : "bg-white text-black/70 hover:bg-white/80"
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ===== Results Info ===== */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-black/60">
            Showing <span className="text-black font-medium">{filteredResults.length}</span>{" "}
            results
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-black/60">Sort by:</span>
            <select className="bg-white px-4 py-2 rounded-lg outline-none cursor-pointer shadow-sm">
              <option>Most Recent</option>
              <option>Most Popular</option>
              <option>Highest Rated</option>
            </select>
          </div>
        </div>

        {/* ===== Results Grid ===== */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResults.map((result, index) => (
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
                  src={result.image}
                  alt={result.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Heart className="w-5 h-5 text-[#c97b63]" />
                  </motion.button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2 group-hover:text-[#c97b63] transition-colors">
                  {result.title}
                </h3>
                <p className="text-sm text-black/60">by {result.designer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== Load More ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#c97b63] text-white px-12 py-4 rounded-xl shadow-lg"
          >
            Load More Results
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
