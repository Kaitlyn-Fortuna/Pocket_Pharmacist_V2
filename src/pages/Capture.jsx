import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, RotateCcw, Send, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getPresignedUploadUrl, uploadToS3, analyzePhoto } from "../components/api/mockApi";

export default function Capture() {
  const [mode, setMode] = useState("camera"); // camera | preview | uploading
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setCameraError("Camera access denied. Please allow camera permissions and try again.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (mode === "camera") {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mode]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    setMode("preview");
  };

  const retake = () => {
    setCapturedImage(null);
    setMode("camera");
  };

  const submitPhoto = async () => {
    setMode("uploading");
    // 1. Get presigned URL
    const { uploadUrl, objectKey } = await getPresignedUploadUrl();
    // 2. Convert to blob and upload to S3
    const response = await fetch(capturedImage);
    const blob = await response.blob();
    await uploadToS3(uploadUrl, blob);
    // 3. Send S3 key for analysis
    const result = await analyzePhoto(objectKey);
    // 4. Navigate to results with data
    navigate("/Results", { state: { result } });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <img
              src="pocket-pharmacist.png"
              alt="Pocket Pharmacist"
              className="w-12 h-12 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Medication Scan</h1>
            <p className="text-xs text-muted-foreground">Photograph a pill bottle or prescription</p>
          </div>
        </div>
      </div>

      {/* Camera / Preview Area */}
      <div className="px-4">
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-black shadow-2xl">
          <AnimatePresence mode="wait">
            {mode === "camera" && (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                    <Camera className="w-12 h-12 text-white/30 mb-4" />
                    <p className="text-white/70 text-sm">{cameraError}</p>
                    <Button onClick={startCamera} variant="secondary" className="mt-4" size="sm">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Viewfinder overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-8 border-2 border-white/30 rounded-2xl" />
                      <div className="absolute top-8 left-8 w-8 h-8 border-t-3 border-l-3 border-white rounded-tl-xl" />
                      <div className="absolute top-8 right-8 w-8 h-8 border-t-3 border-r-3 border-white rounded-tr-xl" />
                      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-3 border-l-3 border-white rounded-bl-xl" />
                      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-3 border-r-3 border-white rounded-br-xl" />
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                      <p className="text-white/60 text-xs font-medium bg-black/30 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full">
                        Align pill bottle within frame
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {(mode === "preview" || mode === "uploading") && capturedImage && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                {mode === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                    </div>
                    <p className="text-white font-medium text-sm">Analyzing medication...</p>
                    <p className="text-white/60 text-xs">This may take a few seconds</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pt-6 pb-4">
        {mode === "camera" && !cameraError && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
            <button
              onClick={capturePhoto}
              className="relative w-20 h-20 rounded-full bg-white border-4 border-primary shadow-lg active:scale-95 transition-transform"
            >
              <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-pulse-ring" />
            </button>
          </motion.div>
        )}

        {mode === "preview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <Button onClick={retake} variant="outline" size="lg" className="flex-1 h-14 rounded-2xl text-base gap-2">
              <RotateCcw className="w-5 h-5" />
              Retake
            </Button>
            <Button onClick={submitPhoto} size="lg" className="flex-1 h-14 rounded-2xl text-base gap-2 bg-primary hover:bg-primary/90">
              <Send className="w-5 h-5" />
              Analyze
            </Button>
          </motion.div>
        )}

        {mode === "uploading" && (
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">Processing your image...</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}