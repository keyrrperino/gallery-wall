"use client";

import { useState } from "react";
import ExitButton from "@marketing/shared/components/ExitButton";
import PhotoPreview from "./PhotoPreview";
import SavingAnimationScreen from "./SavingAnimationScreen";
import ConfirmRetake from "./ConfirmRetake";    
import { useRouter } from "next/navigation";
import SavingDoneScreen from "./SavingDoneScreen";

export default function SaveImageFlow() {
  const [showConfirmRetake, setShowConfirmRetake] = useState(false);
  const [phase, setPhase] = useState<"preview" | "saving" | "done">("preview");
  const router = useRouter();

  return (
    <div className="flex w-full h-full flex-col gap-12 items-center bg-white pb-20">
      {/* TOP BAR */}
      <div className="flex w-full items-center justify-end h-80 px-16 font-text-bold text-black">
        <ExitButton />
      </div>

      {/* CONTENT */}
      <div className="w-full h-full flex-col">
        {phase === "preview" && (
          <PhotoPreview onRetake={() => setShowConfirmRetake(true)} onUsePhoto={() => setPhase("saving")} />
        )}
        {phase === "saving" && (
          <SavingAnimationScreen onComplete={() => setPhase("done")} />
        )}
        {phase === "done" && <SavingDoneScreen />}
      </div>
      
      {showConfirmRetake && (
        <ConfirmRetake
          onCancel={() => setShowConfirmRetake(false)}
          onConfirm={() => {
            router.push("/pledge-a-photo");
          }}
        />
      )}
    </div>
  );
}
