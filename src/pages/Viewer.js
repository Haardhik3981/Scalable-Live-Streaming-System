import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";
import { io } from "socket.io-client";

function Viewer() {
  const { id } = useParams(); // streamKey from URL
  const videoRef = useRef();
  const socketRef = useRef(null); // keep socket across renders
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    // 🧠 Connect to Socket.IO backend
    socketRef.current = io("http://localhost:5050");

    // 🧠 Tell server: “Viewer joined this stream”
    socketRef.current.emit("viewer:join", { streamKey: id });
    fetch(`http://localhost:5050/api/streams/viewers/${id}`)
    .then(res => res.json())
    .then(data => setViewerCount(data.viewerCount || 0));

    // 🧠 HLS Video Player Setup
    const video = videoRef.current;
    const streamURL = `http://localhost:8080/hls/${id}.m3u8`;

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
