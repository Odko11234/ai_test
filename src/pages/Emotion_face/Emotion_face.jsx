import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const CameraAgeGender = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [info, setInfo] = useState("");

  // Emotion-г Монгол хэл рүү хөрвүүлэх map
  const emotionMap = {
    happy: "Баяртай",
    sad: "Уйтгарласан",
    angry: "Ууртай",
    fearful: "Айсан",
    disgusted: "Жигшсэн",
    surprised: "Гайхсан",
    neutral: "Тогтвортой",
  };

  useEffect(() => {
    let stream;

    const startVideo = async () => {
      try {
        if (stream) stream.getTracks().forEach((t) => t.stop());
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
    };

    const detect = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const displaySize = {
        width: video.videoWidth || 640,
        height: video.videoHeight || 480,
      };
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);

      const run = async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions()
          .withAgeAndGender();

        const resized = faceapi.resizeResults(detections, displaySize);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        resized.forEach((det) => {
          const { x, y, width, height } = det.detection.box;
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);

          // Emotion
          const expressions = det.expressions;
          const topEmotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );
          const emotionMn = emotionMap[topEmotion] || topEmotion;

          // Age + Gender
          const age = Math.round(det.age);
          const gender = det.gender === "male" ? "Эрэгтэй" : "Эмэгтэй";

          const text = `${gender}, ~${age} нас, ${emotionMn}`;
          ctx.font = "16px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(text, x, y > 20 ? y - 8 : y + 22);

          setInfo(text);
        });

        requestAnimationFrame(run);
      };

      run();
    };

    const init = async () => {
      await loadModels();
      await startVideo();
      if (videoRef.current) videoRef.current.onloadedmetadata = detect;
    };

    init();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {info && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {info}
        </div>
      )}
    </div>
  );
};

export default CameraAgeGender;
