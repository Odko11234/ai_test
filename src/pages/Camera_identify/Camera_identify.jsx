import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const Camera_identify = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const modelRef = useRef(null);

  useEffect(() => {
    let stream;
    const setupCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    };

    const runDetection = async () => {
      if (!videoRef.current || !canvasRef.current || !modelRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const detectFrame = async () => {
        if (!modelRef.current) return;

        const predictions = await modelRef.current.detect(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        predictions.forEach((pred) => {
          const [x, y, width, height] = pred.bbox;
          ctx.strokeStyle = "lime";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          ctx.font = "18px Arial";
          ctx.fillStyle = "lime";
          ctx.fillText(
            `${pred.class} (${Math.round(pred.score * 100)}%)`,
            x,
            y > 20 ? y - 5 : y + 20
          );
        });

        requestAnimationFrame(detectFrame);
      };

      detectFrame();
    };

    const init = async () => {
      await setupCamera();
      modelRef.current = await cocoSsd.load();
      if (videoRef.current) videoRef.current.onloadedmetadata = runDetection;
    };

    init();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Камер сонгох dropdown */}
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
          <option value="environment">Back Camera</option>
          <option value="user">Selfie Camera</option>
        </select>
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
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
    </div>
  );
};

export default Camera_identify;
