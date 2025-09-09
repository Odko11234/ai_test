import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import EmotionFace from "./pages/Emotion_face/Emotion_face";

function App() {
  return (
    <>
      <Router>
        <header className="navbar">
          <h3
            className="logo "
            onClick={() => (window.location.pathname = "/")}
          >
            Odkoo's AI
          </h3>
          <button
            className="menu-toggle"
            onClick={() =>
              document.querySelector(".nav-links").classList.toggle("open")
            }
          >
            ☰
          </button>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/emotion_face">Emotion Face</Link>
            {/* <Link to="/camera_identify">Camera Identify</Link> */}
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/emotion_face" element={<EmotionFace />} />
            {/* <Route path="/camera_identify" element={<CameraIdentify />} /> */}
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
