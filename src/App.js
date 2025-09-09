import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import EmotionFace from "./pages/Emotion_face/Emotion_face";
import CameraIdentify from "./pages/Camera_identify/Camera_identify";

function App() {
  return (
    <>
      <div>
        <h1 style={{ textAlign: "center" }}>Odkoo's AI</h1>
        <div>
          {" "}
          <a href="/" style={{ margin: "10px" }}>
            Home
          </a>
        </div>
        <div>
          <a href="/emotion_face" style={{ margin: "10px" }}>
            Emotion Face
          </a>
        </div>
        <div>
          <a href="/camera_identify" style={{ margin: "10px" }}>
            Camera Identify
          </a>
        </div>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/emotion_face" element={<EmotionFace />} />
          <Route path="/camera_identify" element={<CameraIdentify />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
