import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";
import { io } from "socket.io-client";
//const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5050";
//const API_BASE = "https://api.haardhiksimplestream.live";
//const HLS_BASE = process.env.REACT_APP_HLS_BASE || "http://localhost:8080";
//const HLS_BASE = "https://cdn.haardhiksimplestream.live";
const API_BASE = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
const HLS_BASE = (process.env.REACT_APP_HLS_BASE || '').replace(/\/$/, '');
if (!API_BASE || !HLS_BASE) {
  // Fail hard during build/runtime so we notice immediately
  // eslint-disable-next-line no-console
  console.error('❌ Missing REACT_APP_API_BASE or REACT_APP_HLS_BASE at build time.', {
    API_BASE, HLS_BASE
  });
  throw new Error('Missing REACT_APP_API_BASE / REACT_APP_HLS_BASE');
}
function Viewer() {
  const { id } = useParams(); // streamKey from URL
  const videoRef = useRef();
  const socketRef = useRef(null); // keep socket across renders
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    // 🧠 Connect to Socket.IO backend
    socketRef.current = io(API_BASE, {
      path: "/socket.io/",
      transports: ["websocket", "polling"],  // allow both; CF supports WS
    });

    // 🧠 Tell server: “Viewer joined this stream”
    socketRef.current.emit("viewer:join", { streamKey: id });
    fetch(`${API_BASE}/api/streams/viewers/${id}`)
    .then(res => res.json())
    .then(data => setViewerCount(data.viewerCount || 0));

    // 🧠 HLS Video Player Setup
    const video = videoRef.current;
    //http://localhost:8080/hls/${id}.m3u8
    const streamURL = `${HLS_BASE}/hls/${id}.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamURL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamURL;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }

    // 🧠 When viewer leaves page or reloads — emit "viewer:leave"
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("viewer:leave", { streamKey: id });
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Viewing Stream: {id}</h2>
      <p>👥 Viewers: {viewerCount}</p>
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{ width: "100%", maxWidth: "800px", backgroundColor: "#000" }}
      />
    </div>
  );
}

export default Viewer;
