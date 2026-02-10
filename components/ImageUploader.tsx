import React, { useRef, useState, useEffect } from 'react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Attach stream to video element
  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefers rear camera on mobile, works as webcam on PC
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas size to video resolution
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally if it's a front facing camera/webcam usually, 
        // but 'environment' is usually not mirrored. We'll draw normally.
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
            onImageSelected(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
    event.target.value = '';
  };

  // Render the Camera View
  if (isCameraOpen) {
    return (
      <div className="flex flex-col items-center justify-center p-4 h-full w-full animate-fade-in">
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl w-full max-w-md relative aspect-[3/4] flex items-center justify-center border-4 border-gray-800">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-4 mt-6 w-full max-w-md">
          <button
            onClick={stopCamera}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={capturePhoto}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2"
          >
            <span>📸</span> Snap!
          </button>
        </div>
      </div>
    );
  }

  // Render the Selection Menu
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-fade-in-up">
      <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-yellow-400 w-full max-w-sm text-center">
        <span className="text-6xl mb-4 block">📸</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Identify a Landmark!</h2>
        <p className="text-gray-500 mb-6">How do you want to find it?</p>
        
        {cameraError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold border border-red-200">
            {cameraError}
          </div>
        )}

        {/* Hidden Input for Gallery */}
        <input
          type="file"
          accept="image/*"
          ref={galleryInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-4 w-full">
          <button
            onClick={startCamera}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-6 rounded-2xl shadow-[0_6px_0_rgb(21,128,61)] active:shadow-[0_2px_0_rgb(21,128,61)] active:translate-y-1 transition-all border-2 border-green-700 flex items-center justify-center gap-3"
          >
            <span>📷</span> Open Camera
          </button>

          <button
            onClick={() => galleryInputRef.current?.click()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-6 rounded-2xl shadow-[0_6px_0_rgb(29,78,216)] active:shadow-[0_2px_0_rgb(29,78,216)] active:translate-y-1 transition-all border-2 border-blue-700 flex items-center justify-center gap-3"
          >
            <span>🖼️</span> Pick from Gallery
          </button>
        </div>
      </div>

      <div className="bg-yellow-100 p-4 rounded-2xl border-2 border-yellow-300 max-w-sm">
        <p className="text-sm text-yellow-800 font-bold text-center">
          💡 Tip: Make sure the landmark is clearly visible in the center!
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;