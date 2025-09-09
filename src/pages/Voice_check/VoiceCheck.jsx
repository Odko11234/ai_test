import React, { useState } from "react";

const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [bgColor, setBgColor] = useState("#f5f5f5");

  // Зөвшөөрөгдсөн өнгөний нэрүүд
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "pink",
    "purple",
    "lime",
    "cyan",
    "magenta",
    "black",
  ];

  let recognition;

  // Дуугаар өнгө солих функц
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // эсвэл "mn-MN"
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);

      // Хэрвээ текст дотор зөвшөөрөгдсөн өнгөний нэр байвал background өнгийг өөрчлөх
      const foundColor = colors.find((c) => text.includes(c));
      if (foundColor) {
        setBgColor(foundColor);
        console.log(`Өнгө солигдлоо: ${foundColor}`);
      } else {
        console.log("Өнгөний нэр олдсонгүй");
      }
    };

    recognition.onend = () => setListening(false);

    if (!listening) {
      setTranscript("");
      setListening(true);
      recognition.start();
      console.log("☝️ Дууны командыг сонсож эхэллээ...");
    } else {
      recognition.stop();
      setListening(false);
      console.log("✋ Сонсохыг зогсоолоо");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        transition: "background 0.5s ease",
        background: bgColor,
        minHeight: "80vh",
      }}
    >
      {/* Дуу сонсох товч */}
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
          transition: "background 0.3s ease",
        }}
      >
        {listening ? "🎤 Сонсож байна..." : "🎙️ Дууны командыг эхлүүлэх"}
      </button>

      {/* Сонсогдсон текстийг харуулах */}
      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        {transcript && `Сонсогдсон текст: "${transcript}"`}
      </p>

      {/* Тайлбар */}
      <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
        Хэлсэн өнгөний нэрээр background өнгө автоматаар солигдоно. Жишээ:
        "red", "blue", "green"...
      </p>
    </div>
  );
};

export default VoiceAssistant;
