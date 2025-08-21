"use client";

import { useEffect, useState } from "react";
import ExitButton from "@marketing/shared/components/ExitButton";
import PhotoPreview from "./PhotoPreview";
import SavingAnimationScreen from "./SavingAnimationScreen";
import ConfirmRetake from "./ConfirmRetake";
import { useRouter, useSearchParams } from "next/navigation";
import SavingDoneScreen from "./SavingDoneScreen";
import { supabase } from "../../../../lib/supabaseClient";
import { RequestStatusSchema } from "../../../../../../packages/database";
import { useUser } from "@saas/auth/hooks/use-user";
import { Logo } from "@shared/components/Logo";
import { cn } from "@ui/lib";

export default function SaveImageFlow() {
  const { gifUrl } = useUser();
  const searchParams = useSearchParams();
  const userGifRequestId = searchParams.get("userGifRequestId");
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}&`
    : "?";
  const [showConfirmRetake, setShowConfirmRetake] = useState(false);
  const [phase, setPhase] = useState<"preview" | "saving" | "done">("preview");
  const router = useRouter();

  const onComplete = async () => {
    try {
      const { error } = await supabase
        .from("UserGifRequest")
        .update({
          gifUrl,
          requestStatus: RequestStatusSchema.Enum.SUCCESS,
        })
        .eq("id", userGifRequestId);

      if (error) {
        // Check if it's a JWT error
        if (
          error.message?.includes("JWT") ||
          error.message?.includes("InvalidJWT") ||
          error.message?.includes("Invalid Compact JWS")
        ) {
          console.error("JWT error detected, clearing auth tokens...");
          // You might want to show a user-friendly message here
          alert("Authentication error. Please refresh the page and try again.");
          return;
        }
        throw error;
      }

      setPhase("done");
    } catch (error) {
      console.error("Error updating gif request:", error);
      // Handle other errors appropriately
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <div className="flex w-full h-full flex-col gap-[1vw] items-center bg-white pb-20">
      {/* TOP BAR */}
      <div
        className={cn(
          "flex w-full items-center justify-between px-16 pt-[46px] transition-opacity duration-300",
          ["saving", "done"].includes(phase) && "opacity-0 pointer-events-none"
        )}
      >
        <div className="w-12 h-12"></div>
        <Logo className="pt-0" />
        <ExitButton />
      </div>

      {/* CONTENT */}
      <div className="w-full h-full flex-col">
        {(phase === "preview" || phase === "saving") && (
          <PhotoPreview
            phase={phase}
            gifUrl={gifUrl ?? ""}
            onRetake={() => setShowConfirmRetake(true)}
            onUsePhoto={() => setPhase("saving")}
            onComplete={() => onComplete()}
          />
        )}
        {/* {phase === "saving" && (
          <SavingAnimationScreen
            phase={phase}
            gifUrl={gifUrl ?? ""}
            onComplete={() => onComplete()}
          />
        )} */}
        {phase === "done" && <SavingDoneScreen />}
      </div>

      {showConfirmRetake && (
        <ConfirmRetake
          onCancel={() => setShowConfirmRetake(false)}
          onConfirm={() => {
            router.push(
              `/pledge-a-photo${additionUrl}userGifRequestId=${userGifRequestId}`
            );
          }}
        />
      )}
    </div>
  );
}
