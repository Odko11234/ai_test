import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();

  // Browser SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US"; // эсвэл "mn-MN" гэж Монгол болгож болно
  recognition.continuous = false;

  useEffect(() => {
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      // Жишээ командууд
      if (text.includes("home")) navigate("/");
      if (text.includes("emotion")) navigate("/emotion_face");
      if (text.includes("camera")) navigate("/camera_identify");
    };

    recognition.onend = () => setListening(false);
  }, []);

  const startListening = () => {
    if (listening) {
      setListening(false);
    } else {
      setTranscript("");
      setListening(true);
      recognition?.start();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={startListening}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          background: listening ? "#ff7675" : "#6c63ff",
          color: "white",
          border: "none",
        }}
      >
        {listening ? "🎤 Listening..." : "🎙️ Start Voice Command"}
      </button>
      <p>{transcript && `Heard: "${transcript}"`}</p>
    </div>
  );
};

export default VoiceAssistant;
