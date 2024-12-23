"use client";

import { useState, useRef } from "react";

export default function WebcamCapture() {
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start the webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing the webcam: ", err);
      alert("Webcam not accessible. Please check device permissions and availability.");
    }
  };
  
  

  // Capture an image from the webcam
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/jpeg");
      setPreviewURL(dataURL); // Update preview
    }
  };

  // Send captured image to a POST endpoint
  const sendImage = async () => {
    if (!previewURL) {
      alert("No image captured to send.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: previewURL }),
      });
      const result = await response.json();
      console.log("Image uploaded:", result);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Error uploading the image:", err);
      alert("Failed to upload the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-[#15151c] rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Webcam Image Capture</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Capture an image from your webcam and send it to a server.
        </p>

        <div className="flex flex-col items-center">
          {/* Webcam Preview */}
          <video
            ref={videoRef}
            className="w-full max-w-md bg-black rounded-lg"
            autoPlay
          ></video>

          {/* Buttons */}
          <div className="space-x-4 mt-4">
            <button
              onClick={startWebcam}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md font-semibold"
            >
              Start Webcam
            </button>
            <button
              onClick={captureImage}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
            >
              Capture Image
            </button>
          </div>

          {/* Preview */}
          {previewURL && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Captured Image:</h2>
              <img
                src={previewURL}
                alt="Captured"
                className="max-w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={sendImage}
            disabled={loading}
            className="mt-4 py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold"
          >
            {loading ? "Uploading..." : "Send Image"}
          </button>
        </div>
      </div>

      {/* Hidden Canvas for Capturing Image */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
