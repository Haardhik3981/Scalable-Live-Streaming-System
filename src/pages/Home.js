import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5050";
//const API_BASE = "https://api.haardhiksimplestream.live";
const API_BASE = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
if (!API_BASE) {
  // Fail hard during build/runtime so we notice immediately
  // eslint-disable-next-line no-console
  console.error('❌ Missing REACT_APP_API_BASE at build time.', {
    API_BASE
  });
  throw new Error('Missing REACT_APP_API_BASE');
}
function Home() {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/streams`)
      .then((res) => res.json())
      .then((data) => setStreams(data))
      .catch((err) => console.error("Failed to fetch streams", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Live Streams</h2>
      <ul>
        {streams.map((stream) => (
          <li key={stream._id} style={{ marginBottom: "1rem" }}>
            <strong>{stream.title}</strong> by {stream.streamerName}
            {stream.isLive ? (
              <span style={{ color: "green", marginLeft: "1rem" }}>🟢 LIVE</span>
            ) : (
              <span style={{ color: "gray", marginLeft: "1rem" }}>offline</span>
            )}
            <br />
            <Link to={`/watch/${stream.streamKey}`}>Watch</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;