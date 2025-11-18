import { motion } from "framer-motion";
import { Heart, Eye, Download, ExternalLink } from "lucide-react";

export function FeaturedProjects() {
  const projects = [
    {
      image:
        "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2128",
      title: "Modern Minimalist Living Room",
      designer: "Sarah Chen",
      style: "Minimalist",
      likes: 1243,
      views: 8542,
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2940",
      title: "Scandinavian Bedroom Retreat",
      designer: "Erik Nordström",
      style: "Scandinavian",
      likes: 987,
      views: 6721,
    },
    {
      image:
        "https://images.unsplash.com/photo-1704428381387-3b457403131d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2069",
      title: "Contemporary Kitchen Design",
      designer: "Maria Rodriguez",
      style: "Contemporary",
      likes: 2156,
      views: 12453,
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1676823570969-da7d0074804d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
      title: "Rustic Dining Experience",
      designer: "James Morrison",
      style: "Rustic",
      likes: 876,
      views: 5432,
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2874",
      title: "Luxury Spa Bathroom",
      designer: "Isabella Costa",
      style: "Luxury",
      likes: 1654,
      views: 9876,
    },
    {
      image:
        "https://images.unsplash.com/photo-1747336754870-ca7b10cc75f5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2946",
      title: "Bohemian Living Space",
      designer: "Luna Martinez",
      style: "Bohemian",
      likes: 1432,
      views: 8234,
    },
  ];

  return (
    <div className="py-24 px-8 bg-white/30">
      <div className="mx-auto">
        {/* ===== Section Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4 font-semibold">Featured Projects</h2>
          <p className="text-xl text-black/60 max-w-2xl mx-auto">
            Explore stunning transformations from our talented community of
            designers
          </p>
        </motion.div>

        {/* ===== Projects Grid ===== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />

                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between p-6"
                >
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                    >
                      <Heart className="w-5 h-5 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                  </motion.button>
                </motion.div>

                {/* Style badge */}
                <div className="absolute top-4 left-4 bg-[#c97b63] text-white px-3 py-1 rounded-lg text-xs backdrop-blur-md">
                  {project.style}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl mb-2 group-hover:text-[#c97b63] transition-colors font-medium">
                  {project.title}
                </h3>
                <p className="text-sm text-black/60 mb-4">
                  by {project.designer}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-black/60">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{project.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{project.views.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#c97b63] text-sm font-medium"
                  >
                    View Details →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#c97b63] text-white px-12 py-4 rounded-xl shadow-lg"
          >
            Load More Projects
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
