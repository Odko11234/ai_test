// src/ObjectDetection.js
import React, { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export default function Camera_Identify() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      return new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => resolve(videoRef.current);
      });
    };

    const runCoco = async () => {
      await setupCamera();
      videoRef.current.play();

      const model = await cocoSsd.load();

      const detectFrame = async () => {
        if (!videoRef.current) return;

        const predictions = await model.detect(videoRef.current);

        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        predictions.forEach((pred) => {
          const [x, y, width, height] = pred.bbox;
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          ctx.font = "18px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(
            `${pred.class} ${Math.round(pred.score * 100)}%`,
            x,
            y > 20 ? y - 5 : y + 20
          );
        });

        requestAnimationFrame(detectFrame);
      };

      detectFrame();
    };

    runCoco();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: 640,
        height: 480,
        margin: "0 auto",
      }}
    >
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        muted
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}
