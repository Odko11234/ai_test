import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const CameraIdentify = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment"); // back camera
  const modelRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let mounted = true;

    const setupCamera = async () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (!mounted) return;

        setStream(newStream);
        if (videoRef.current) videoRef.current.srcObject = newStream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const loadModel = async () => {
      modelRef.current = await cocoSsd.load();
    };

    const runDetection = () => {
      if (!videoRef.current || !canvasRef.current || !modelRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const detectFrame = async () => {
        if (video.readyState < 2) {
          requestAnimationFrame(detectFrame);
          return;
        }

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

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
      await loadModel();
      await setupCamera();

      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          runDetection();
        };
      }
    };

    init();

    return () => {
      mounted = false;
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
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

export default CameraIdentify;
