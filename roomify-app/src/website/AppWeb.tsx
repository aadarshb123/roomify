import { useState, useEffect } from "react";
import "./styles/globals.css";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { CommunityShowcase } from "./components/CommunityShowcase";
import { Footer } from "./components/Footer";

import { ExplorePage } from "./components/ExplorePage";
import { UploadPage } from "./components/UploadPage";
import { ProfilePage } from "./components/ProfilePage";
import { ImageDetailPage } from "./components/ImageDetailPage";
import { WebLogin } from "./components/WebLogin";

function FullWidthCentered({ children }: { children: React.ReactNode }) {
  return <div className="page-wide">{children}</div>;
}

export default function AppWeb() {
  const { user, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState("home");

  // when selecting an image from Explore/Profile
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  // Redirect to home/login when user logs out
  useEffect(() => {
    if (!loading && !user) {
      // User is logged out, show a simple login message
      setCurrentSection("login");
    }
  }, [user, loading]);

  const openImageDetail = (img: any) => {
    setSelectedImage(img);
    setCurrentSection("image-detail");
  };

  const goBack = () => {
    setSelectedImage(null);
    // default back destination is Explore
    setCurrentSection("explore");
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f0ea]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c97b63] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if user is not authenticated
  if (!user) {
    return <WebLogin />;
  }

  return (
    <div className="flex flex-col min-h-screen text-foreground bg-[#f5f0ea] w-full overflow-x-hidden">


      
      <Navigation currentSection={currentSection} setCurrentSection={setCurrentSection} />

      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">

          {/* HOME */}
          {currentSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <section className="hero-section">
                <Hero onNavigate={setCurrentSection} />
              </section>

              <FullWidthCentered>
                <div className="home-content">
                  <FeaturedProjects onNavigate={setCurrentSection} />
                  <CommunityShowcase />
                </div>
              </FullWidthCentered>
            </motion.div>
          )}

          {/* EXPLORE */}
          {currentSection === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExplorePage onSelectImage={openImageDetail} />
            </motion.div>
          )}

          {/* UPLOAD */}
          {currentSection === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UploadPage />
            </motion.div>
          )}

          {/* PROFILE */}
          {currentSection === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfilePage
                setCurrentSection={setCurrentSection}
                setSelectedImage={setSelectedImage}
              />

            </motion.div>
          )}

          {/* IMAGE DETAIL */}
          {currentSection === "image-detail" && selectedImage && (
            <motion.div
              key="image-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ImageDetailPage image={selectedImage} onBack={goBack} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}