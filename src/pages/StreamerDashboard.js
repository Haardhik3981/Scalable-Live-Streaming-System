import React, { useState } from "react";

function StreamerDashboard() {
  const [isLive, setIsLive] = useState(false);
  const streamKey = "mystream"; // Replace with dynamic key if using auth

  const toggleStream = async () => {
    const updated = !isLive;
    const res = await fetch(`http://localhost:5050/api/streams/key/${streamKey}/status`, {
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
