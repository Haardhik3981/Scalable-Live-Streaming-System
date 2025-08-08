import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import StreamerDashboard from "./pages/StreamerDashboard";
import Viewer from "./pages/Viewer";
function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/dashboard" style={{ marginRight: "1rem" }}>Streamer Dashboard</Link>
          <Link to="/watch/mystream">Watch Stream</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<StreamerDashboard />} />
          <Route path="/watch/:id" element={<Viewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
