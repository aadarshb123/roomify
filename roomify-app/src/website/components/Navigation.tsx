import { motion } from "framer-motion";
import { Home, Sparkles, Search, User } from "lucide-react";
import logoR from "../../../assets/logo-r.png";

interface NavigationProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

// 🧩 Dummy profile image (replace later with user profile)
const dummyProfileImg =
  "https://wallpapers.com/images/high/matching-anime-profile-pictures-923-x-948-o86k3jsdjhgtdvp5.webp";

export function Navigation({ currentSection, setCurrentSection }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "ai-studio", label: "AI Studio", icon: Sparkles },
    { id: "search", label: "Search", icon: Search },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#e8decf]/95 backdrop-blur-md border-b border-[#c97b63]/20 shadow-lg"
    >
      <div className="mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* ===== Logo ===== */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#c97b63] to-[#d4956f] flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight">Roomify</h1>
              <p className="text-xs text-black/60">Transform Your Space</p>
            </div>
          </motion.div>

          {/* ===== Nav Tabs ===== */}
          <div className="flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#c97b63] text-white shadow-lg"
                      : "bg-transparent text-black/70 hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* ===== User Profile Section ===== */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer bg-white/50 px-4 py-2 rounded-full"
          >
            <img
              src={dummyProfileImg}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-[#c97b63]"
            />
            <div className="text-left">
              <p className="text-sm font-medium">Akira Tanaka</p>
              <p className="text-xs text-black/60">Pro Designer</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
