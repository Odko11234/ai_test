// import { useEffect, useRef, useState } from "react";
// import * as faceapi from "face-api.js";

// export default function EmotionCamera() {
//   const videoRef = useRef();
//   const canvasRef = useRef();
//   const [emotion, setEmotion] = useState("");

//   useEffect(() => {
//     const loadModels = async () => {
//       await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
//       await faceapi.nets.faceExpressionNet.loadFromUri("/models");
//       startVideo();
//     };

//     const startVideo = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
//       videoRef.current.srcObject = stream;
//     };

//     loadModels();
//   }, []);

//   const handleVideoOnPlay = () => {
//     const displaySize = {
//       width: videoRef.current.width,
//       height: videoRef.current.height,
//     };
//     faceapi.matchDimensions(canvasRef.current, displaySize);

//     setInterval(async () => {
//       const detections = await faceapi
//         .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//         .withFaceExpressions();

//       const resized = faceapi.resizeResults(detections, displaySize);
//       const ctx = canvasRef.current.getContext("2d");
//       ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//       ctx.drawImage(
//         videoRef.current,
//         0,
//         0,
//         canvasRef.current.width,
//         canvasRef.current.height
//       );

//       if (resized.length > 0) {
//         const expressions = resized[0].expressions;
//         const maxEmotion = Object.keys(expressions).reduce((a, b) =>
//           expressions[a] > expressions[b] ? a : b
//         );
//         setEmotion(maxEmotion);
//       }
//     }, 500);
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <video
//         ref={videoRef}
//         width="640"
//         height="480"
//         autoPlay
//         muted
//         onPlay={handleVideoOnPlay}
//       />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         style={{ position: "absolute", top: 0, left: 0 }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           top: 10,
//           left: 10,
//           fontSize: "30px",
//           color: "red",
//         }}
//       >
//         {emotion}
//       </div>
//     </div>
//   );
// }

const Emotion_face = () => {
  return <div>Emotion_face</div>;
};

export default Emotion_face;
