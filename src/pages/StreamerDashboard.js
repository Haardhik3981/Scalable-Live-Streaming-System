import React, { useState } from "react";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5050";

function StreamerDashboard() {
  const [isLive, setIsLive] = useState(false);
  const streamKey = "mystream"; // Replace with dynamic key if using auth

  const toggleStream = async () => {
    const updated = !isLive;
    const res = await fetch(`${API_BASE}/api/streams/key/${streamKey}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLive: updated }),
    });

    if (res.ok) {
      setIsLive(updated); // Update local UI state
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Streamer Dashboard</h2>
      <button onClick={toggleStream}>
        {isLive ? "Stop Stream" : "Start Stream"}
      </button>
    </div>
  );
}

export default StreamerDashboard;
