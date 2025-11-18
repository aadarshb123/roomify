import { motion } from "framer-motion";
import {
  Home,
  Upload as UploadIcon,
  Search,
  User,
  LogOut,
  Images,
  Wand2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavigationProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const dummyProfileImg =
  "https://wallpapers.com/images/high/matching-anime-profile-pictures-923-x-948-o86k3jsdjhgtdvp5.webp";

export function Navigation({ currentSection, setCurrentSection }: NavigationProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logout();
      } catch (error: any) {
        alert("Logout failed: " + error.message);
      }
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Images },
    { id: "upload", label: "Upload", icon: UploadIcon },
    { id: "ai-studio", label: "AI Studio", icon: Wand2 },
    { id: "profile", label: "Profile", icon: User },
  ];

  /** 
   * ============================
   *  AI STUDIO SPECIAL THEME NAV
   * ============================
   */
  const isAIStudio = currentSection === "ai-studio";

  const aiNavClass =
    "bg-gradient-to-b from-[#0a0615]/80 to-[#120a2f]/80 backdrop-blur-xl border-b border-purple-500/20 shadow-[0_0_25px_rgba(150,70,255,0.25)]";

  const defaultNavClass =
    "bg-[#e8decf]/95 backdrop-blur-md border-b border-[#c97b63]/20 shadow-lg";

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isAIStudio ? aiNavClass : defaultNavClass
      }`}
    >
      <div className="mx-auto px-8 py-4">
        <div className="flex items-center justify-between">

          {/* ============================ */}
          {/* LEFT — LOGO AREA */}
          {/* ============================ */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentSection("home")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                isAIStudio
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 shadow-[0_0_18px_rgba(150,70,255,0.35)]"
                  : "bg-gradient-to-br from-[#c97b63] to-[#d4956f]"
              }`}
            >
              <Search className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1
                className={`font-semibold tracking-tight ${
                  isAIStudio ? "text-white" : "text-black"
                }`}
              >
                Roomify
              </h1>
              <p
                className={`text-xs ${
                  isAIStudio ? "text-purple-200/70" : "text-black/60"
                }`}
              >
                Transform Your Space
              </p>
            </div>
          </motion.div>

          {/* ============================ */}
          {/* CENTER — NAV TABS */}
          {/* ============================ */}
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
                    isAIStudio
                      ? isActive
                        ? "bg-purple-700/40 border border-purple-400/40 text-white shadow-[0_0_12px_rgba(150,70,255,0.4)]"
                        : "text-purple-200/80 hover:bg-purple-700/20 hover:border hover:border-purple-400/20"
                      : isActive
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

          {/* ============================ */}
          {/* RIGHT — USER PROFILE */}
          {/* ============================ */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-full ${
                isAIStudio
                  ? "bg-white/10 border border-purple-300/20 text-white backdrop-blur-xl"
                  : "bg-white/50 text-black"
              }`}
            >
              <img
                src={dummyProfileImg}
                alt="Profile"
                className={`w-8 h-8 rounded-full object-cover border-2 ${
                  isAIStudio ? "border-purple-500" : "border-[#c97b63]"
                }`}
              />

              <div className="text-left">
                <p
                  className={`text-sm font-medium ${
                    isAIStudio ? "text-white" : "text-black"
                  }`}
                >
                  {user?.displayName || user?.email || "Guest"}
                </p>

                <p
                  className={`text-xs ${
                    isAIStudio ? "text-purple-200/70" : "text-black/60"
                  }`}
                >
                  Member
                </p>
              </div>
            </motion.div>

            {/* LOGOUT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isAIStudio
                  ? "bg-red-500/20 text-red-200 border border-red-300/30 hover:bg-red-500/30"
                  : "bg-white/50 hover:bg-red-50 text-red-600"
              }`}
              title="Logout"
            >
              <LogOut
                className={`w-4 h-4 ${
                  isAIStudio ? "text-red-300" : "text-red-600"
                }`}
              />
              <span className="text-sm">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
