import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const Emotion_face = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("");

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const loadModels = async () => {
      const MODEL_URL =
        "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const detectEmotion = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const detect = async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        const resized = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (resized.length > 0) {
          const topDetection = resized[0];
          const { x, y, width, height } = topDetection.detection.box;

          // Draw face box
          ctx.strokeStyle = "rgba(255,0,0,0.8)";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);

          // Get top emotion
          const expressions = topDetection.expressions;
          const maxEmotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );

          setEmotion(maxEmotion);

          // Optional: draw emotion above box
          ctx.font = "18px Arial";
          ctx.fillStyle = "rgba(255,0,0,0.9)";
          ctx.fillText(maxEmotion, x, y > 20 ? y - 8 : y + 22);
        } else {
          setEmotion(""); // No face detected
        }

        requestAnimationFrame(detect);
      };

      detect();
    };

    const init = async () => {
      await loadModels();
      await startVideo();
      videoRef.current.onloadeddata = detectEmotion;
    };

    init();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "90%",
          maxWidth: "800px",
          aspectRatio: "16/9",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0,0,0,0.7)",
          border: "2px solid #ff4d4f",
        }}
      >
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
        {emotion && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {emotion}
          </div>
        )}
      </div>
    </div>
  );
};

export default Emotion_face;
