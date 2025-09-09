import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Emotion_face from "./pages/Emotion_face/Emotion_face";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/emotion_face" element={<Emotion_face />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
