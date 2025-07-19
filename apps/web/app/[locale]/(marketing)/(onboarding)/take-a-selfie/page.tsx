"use client";
import { useState } from "react";
import MainSelfiePage from "@marketing/take-a-selfie/components/MainSelfiePage";
import SelfieCameraMode from "@marketing/take-a-selfie/components/SelfieCameraMode";

export default function TakeASelfie() {
  const [isCameraMode, setIsCameraMode] = useState(false);

  return (
    <div className="absolute top-0 flex h-screen w-screen">
      {!isCameraMode ? (
        <MainSelfiePage onStart={() => setIsCameraMode(true)} />
      ) : (
        <SelfieCameraMode onExit={() => setIsCameraMode(false)} />
      )}
    </div>
  );
}
