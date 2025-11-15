import { motion } from "framer-motion";
import { Home, Upload as UploadIcon, Search, User, LogOut, Images } from "lucide-react";
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

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentSection("home")}
          >
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#c97b63] to-[#d4956f] flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight">Roomify</h1>
              <p className="text-xs text-black/60">Transform Your Space</p>
            </div>
          </motion.div>

          {/* Tabs */}
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

          {/* User */}
          <div className="flex items-center gap-3">
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
                <p className="text-sm font-medium">
                  {user?.displayName || user?.email || "Guest"}
                </p>
                <p className="text-xs text-black/60">Member</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/50 hover:bg-red-50 px-4 py-2 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}