import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const CameraEmotion = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [facingMode, setFacingMode] = useState("user"); // default selfie
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const streamRef = useRef(null);

  // 🔹 FaceAPI models ачаалах
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL =
        "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // 🔹 Камераа эхлүүлэх
  useEffect(() => {
    const startVideo = async () => {
      try {
        // өмнөх stream зогсоох
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    if (modelsLoaded) {
      startVideo();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, modelsLoaded]);

  // 🔹 Emotion detection
  useEffect(() => {
    if (!modelsLoaded) return;

    const detectEmotion = async () => {
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

      const runDetection = async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        const resized = faceapi.resizeResults(detections, displaySize);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        resized.forEach((det) => {
          const { x, y, width, height } = det.detection.box;
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);

          const expressions = det.expressions;
          const topEmotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );
          ctx.font = "18px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(topEmotion, x, y > 20 ? y - 8 : y + 22);
        });

        setEmotion(
          resized[0]?.expressions
            ? Object.keys(resized[0].expressions).reduce((a, b) =>
                resized[0].expressions[a] > resized[0].expressions[b] ? a : b
              )
            : ""
        );

        requestAnimationFrame(runDetection);
      };

      runDetection();
    };

    // Video бэлэн болмогц detection эхлүүлэх
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = detectEmotion;
    }
  }, [modelsLoaded, facingMode]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Camera сонгох dropdown */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          background: "rgba(0,0,0,0.6)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <label style={{ color: "white", marginRight: "8px" }}>📷 Camera:</label>
        <select
          value={facingMode}
          onChange={(e) => setFacingMode(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "none",
            fontSize: "16px",
          }}
        >
          <option value="user">Selfie Camera</option>
          <option value="environment">Back Camera</option>
        </select>
      </div>

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
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.6)",
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
  );
};

export default CameraEmotion;
