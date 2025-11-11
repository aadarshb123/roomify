import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";

// --- mobile & web entrypoints ---
import RootNavigator from "./src/mobile/navigation/RootNavigator"; // mobile
import WebsiteApp from "./src/website/AppWeb"; // web

export default function App() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isDesktop = isWeb && width > 1000; // desktop breakpoint

  return (
    <AuthProvider>
      {isDesktop ? (
        <WebsiteApp /> // show website layout on desktop
      ) : (
        <>
          <RootNavigator /> {/* mobile navigation */}
          <StatusBar style="auto" />
        </>
      )}
    </AuthProvider>
  );
}