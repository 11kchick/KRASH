import { useState, useRef, useCallback } from "react";
import { Camera, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onCancel?: () => void;
  existingPhotoUrl?: string | null;
}

const CameraCapture = ({ onCapture, onCancel, existingPhotoUrl }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const startCamera = useCallback(async (facing: "user" | "environment" = facingMode) => {
    setError(null);
    setCapturedImage(null);
    setCapturedBlob(null);
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
    } catch {
      setError("Camera access denied. Please allow camera permissions to take your profile photo.");
      setIsStreaming(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    // Mirror for front camera
    if (facingMode === "user") {
      ctx.translate(512, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 512, 512);
    canvas.toBlob((blob) => {
      if (blob) {
        setCapturedImage(canvas.toDataURL("image/jpeg", 0.9));
        setCapturedBlob(blob);
        stopCamera();
      }
    }, "image/jpeg", 0.9);
  }, [facingMode, stopCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedBlob) {
      onCapture(capturedBlob);
    }
  }, [capturedBlob, onCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setCapturedBlob(null);
    startCamera();
  }, [startCamera]);

  const flipCamera = useCallback(() => {
    const newFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacing);
    if (isStreaming) {
      startCamera(newFacing);
    }
  }, [facingMode, isStreaming, startCamera]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />

      <AnimatePresence mode="wait">
        {!isStreaming && !capturedImage && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            {existingPhotoUrl && (
              <img
                src={existingPhotoUrl}
                alt="Current profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
            )}
            {!existingPhotoUrl && (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-dashed border-muted-foreground/30">
                <Camera className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center font-body">
              {existingPhotoUrl ? "Retake your profile photo" : "Take a live photo for your profile"}
            </p>
            <p className="text-xs text-muted-foreground/70 text-center font-body">
              For safety, photos must be taken live — no uploads allowed.
            </p>
            <Button variant="hero" onClick={() => startCamera()}>
              <Camera className="w-4 h-4 mr-2" />
              {existingPhotoUrl ? "Retake Photo" : "Open Camera"}
            </Button>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
            )}
          </motion.div>
        )}

        {isStreaming && (
          <motion.div
            key="streaming"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary shadow-elevated">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={facingMode === "user" ? { transform: "scaleX(-1)" } : undefined}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" onClick={flipCamera} aria-label="Flip camera">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="hero" size="lg" onClick={takePhoto}>
                <Camera className="w-5 h-5 mr-2" /> Capture
              </Button>
              <Button variant="outline" size="icon" onClick={() => { stopCamera(); onCancel?.(); }} aria-label="Cancel camera">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {capturedImage && (
          <motion.div
            key="captured"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-secondary shadow-elevated">
              <img src={capturedImage} alt="Your captured profile photo preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm text-muted-foreground font-body">Looking good?</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={retake}>
                <RotateCcw className="w-4 h-4 mr-2" /> Retake
              </Button>
              <Button variant="hero" onClick={confirmPhoto}>
                <Check className="w-4 h-4 mr-2" /> Use This Photo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-sm text-destructive text-center font-body">{error}</p>
      )}
    </div>
  );
};

export default CameraCapture;
