import React, { useState } from "react";
import "./UploadRoomPage.css";

export default function UploadRoomPage() {
  const [preview, setPreview] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStyles, setRoomStyles] = useState([]);

  const roomTypeOptions = [
    "Bedroom",
    "Living Room",
    "Kitchen",
    "Office",
    "Bathroom",
    "Décor",
  ];

  const styleOptions = [
    "Modern",
    "Minimalist",
    "Coastal",
    "Scandinavian",
    "Art Deco",
  ];

  // Handle image upload preview
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  // Toggle selection of chips
  function toggleSelection(list, setList, value) {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  }

  return (
    <div className="upload-page">

      {/* Page Header */}
      <h1>Upload Your Room</h1>

      {/* Upload Image Section */}
      <div
        className="upload-box"
        onClick={() => document.getElementById("fileInput").click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="preview-img" />
        ) : (
          <p>+ Upload Image</p>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
      </div>

      {/* Room Type */}
      <h2>Room Type</h2>
      <div className="chip-container">
        {roomTypeOptions.map((type) => (
          <div
            key={type}
            className={`chip ${roomTypes.includes(type) ? "chip-selected" : ""}`}
            onClick={() => toggleSelection(roomTypes, setRoomTypes, type)}
          >
            {type}
          </div>
        ))}
        <div className="chip chip-add">+</div>
      </div>

      {/* Room Style */}
      <h2>Room Style</h2>
      <div className="chip-container">
        {styleOptions.map((style) => (
          <div
            key={style}
            className={`chip ${roomStyles.includes(style) ? "chip-selected" : ""}`}
            onClick={() => toggleSelection(roomStyles, setRoomStyles, style)}
          >
            {style}
          </div>
        ))}
        <div className="chip chip-add">+</div>
      </div>

      {/* Description Box */}
      <textarea
        className="description"
        placeholder="Add a description..."
      ></textarea>

      {/* Buttons */}
      <button className="btn save">Save to My Pins</button>
      <button className="btn share">Share to Explore Feed</button>

      {/* 🚧 TEMPORARY: Placeholder bottom nav (remove when global nav is added) */}
      <div className="bottom-nav placeholder-nav">
        <span>🏠</span>
        <span>🔍</span>
        <span className="plus">＋</span>
        <span>❤️</span>
        <span>👤</span>
      </div>
    </div>
  );
}
