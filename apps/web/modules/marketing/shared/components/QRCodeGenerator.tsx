"use client";

import { useEffect, useRef, useState } from "react";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeGenerator({
  value,
  size = 335,
  className = "",
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    if (!value) {
      setIsLoading(true);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("QRCodeGenerator: Failed to get canvas context");
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&format=png&margin=35`;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = (error) => {
      console.error(`QRCodeGenerator: Failed to load QR code:`, error);
    };
    img.src = qrUrl;
  }, [value, size]);

  return (
    <div className={`inline-block relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-md shadow-md border"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-sm text-gray-600 mt-2">Generating QR Code...</p>
          </div>
        </div>
      )}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-md border-2 border-red-200">
          <div className="text-center">
            <p className="text-sm text-red-600 font-medium">QR Code Error</p>
            <p className="text-xs text-red-500 mt-1">Check fallback display</p>
          </div>
        </div>
      )}
    </div>
  );
}
