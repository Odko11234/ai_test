import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Emotion_face from "./pages/Emotion_face/Emotion_face";
import Camera_identify from "./pages/Camera_identify/Camera_identify";

function App() {
  return (
    <>
      <div>
        <h1 style={{ textAlign: "center" }}>AI Test Applications</h1>
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
          <Route path="/emotion_face" element={<Emotion_face />} />
          <Route path="/camera_identify" element={<Camera_identify />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
