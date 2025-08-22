'use client';

import { useEffect, useRef, useState } from 'react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeGenerator({
  value,
  size = 335,
  className = '',
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
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('QRCodeGenerator: Failed to get canvas context');
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&format=png&margin=35`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
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
    <div className={`relative inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-md border shadow-md"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-100">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm text-gray-600">Generating QR Code...</p>
          </div>
        </div>
      )}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md border-2 border-red-200 bg-red-50">
          <div className="text-center">
            <p className="text-sm font-medium text-red-600">QR Code Error</p>
            <p className="mt-1 text-xs text-red-500">Check fallback display</p>
          </div>
        </div>
      )}
    </div>
  );
}
