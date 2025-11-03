import { useState } from "react";
import "./styles/globals.css";
import { AnimatePresence, motion } from "framer-motion";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { AIDesignStudio } from "./components/AIDesignStudio";
import { SearchPage } from "./components/SearchPage";
import { ProfilePage } from "./components/ProfilePage";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { CommunityShowcase } from "./components/CommunityShowcase";
import { Footer } from "./components/Footer";

function FullWidthCentered({ children }: { children: React.ReactNode }) {
  return <div className="page-wide">{children}</div>;
}

export default function AppWeb() {
  const [currentSection, setCurrentSection] = useState("home");

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-x-hidden bg-[#f5f0ea]">
      <Navigation currentSection={currentSection} setCurrentSection={setCurrentSection} />

      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          {/* ==================== HOME ==================== */}
          {currentSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <section className="hero-section">
                <Hero />
              </section>

              <FullWidthCentered>
                <div className="home-content">
                  <FeaturedProjects />
                  <CommunityShowcase />
                </div>
              </FullWidthCentered>
            </motion.div>
          )}

          {/* ==================== AI STUDIO ==================== */}
          {currentSection === "ai-studio" && (
            <motion.div
              key="ai-studio"
              className="tab-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
            <AIDesignStudio />
            </motion.div>
          )}

          {/* ==================== SEARCH ==================== */}
          {currentSection === "search" && (
            <motion.div
              key="search"
              className="tab-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
            <SearchPage />
            </motion.div>
          )}

          {/* ==================== PROFILE ==================== */}
          {currentSection === "profile" && (
            <motion.div
              key="profile"
              className="tab-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfilePage />
              </motion.div>
          )}
          
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}