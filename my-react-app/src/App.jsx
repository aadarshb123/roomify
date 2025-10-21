import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadRoomPage from "./pages/UploadRoomPage"; // <-- this is the file you'll create
import HomePage from "./pages/HomePage"; // placeholder for now

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home route - placeholder (team will replace this later) */}
        <Route path="/" element={<HomePage />} />

        {/* Your upload page */}
        <Route path="/upload" element={<UploadRoomPage />} />
      </Routes>
    </Router>
  );
}