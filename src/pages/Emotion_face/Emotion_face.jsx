import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const CameraEmotion = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("");

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
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

    const detect = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const video = videoRef.current;

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const runDetection = async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        const resized = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext("2d");
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

        // Хамгийн эхний detected face-ийн emotion-г state-д хадгалах
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

    const init = async () => {
      await loadModels();
      await startVideo();
      videoRef.current.onloadeddata = detect;
    };

    init();
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
