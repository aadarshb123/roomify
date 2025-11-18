import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Zap } from "lucide-react";

const heroBg =
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=2000&q=80";

interface HeroProps {
  onNavigate: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="hero-section relative h-screen overflow-hidden bg-[#f5f0ea]">
      {/* ===== Background image with smooth parallax ===== */}
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img
          src={heroBg}
          alt="Modern interior design background"
          className="w-full h-full object-cover"
        />
        {/* Overlay blend for readability + shorter fade */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-transparent to-[#f5f0ea]" />
        </div>
      </motion.div>

      {/* ===== Floating particles ===== */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/25 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* ===== Hero content ===== */}
      <div className="relative z-10 mx-auto px-8 pt-32 pb-4">
        <div className="max-w-3xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm text-white">
              AI-Powered Interior Design Revolution
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-7xl text-white mb-6 leading-tight font-semibold drop-shadow-lg"
          >
            Transform Your Space
            <br />
            <span className="text-[#f4c89d]">In Seconds</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 mb-10 leading-relaxed drop-shadow-md"
          >
            Experience the future of interior design with our cutting-edge AI
            technology. Upload a photo, choose your style, and watch magic
            happen instantly.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(201, 123, 99, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("upload")}
              className="flex items-center gap-3 bg-linear-to-r from-[#c97b63] to-[#d4956f] text-white px-8 py-4 rounded-xl shadow-2xl"
            >
              <Wand2 className="w-5 h-5" />
              <span className="text-lg font-medium">Start Designing Now</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("explore")}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl border border-white/20"
            >
              <span className="text-lg font-medium">View Examples</span>
            </motion.button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-8 mt-12"
          >
            {[
              { icon: Zap, text: "Instant Results" },
              { icon: Sparkles, text: "50+ Design Styles" },
              { icon: Wand2, text: "Professional Quality" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
