import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const Camera_identify = () => {
  const videoRef = useRef < HTMLVideoElement > null;
  const canvasRef = useRef < HTMLCanvasElement > null;
  const [facingMode, setFacingMode] =
    (useState < "user") | ("environment" > "environment");

  useEffect(() => {
    let model = null;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const runDetection = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      if (!model) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const detectFrame = async () => {
        if (!model || video.readyState !== 4) {
          requestAnimationFrame(detectFrame);
          return;
        }

        const predictions = await model.detect(video);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        predictions.forEach((pred) => {
          const [x, y, width, height] = pred.bbox;
          ctx.strokeStyle = "lime";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          ctx.font = "20px Arial";
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
      model = await cocoSsd.load();

      if (videoRef.current) {
        videoRef.current.onloadeddata = () => {
          runDetection();
        };
      }
    };

    init();
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
