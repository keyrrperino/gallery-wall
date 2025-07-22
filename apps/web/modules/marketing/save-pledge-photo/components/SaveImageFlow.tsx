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

export default function SaveImageFlow() {
  const { gifUrl } = useUser();
  const searchParams = useSearchParams();
  const userGifRequestId = searchParams.get("userGifRequestId");
  const [showConfirmRetake, setShowConfirmRetake] = useState(false);
  const [phase, setPhase] = useState<"preview" | "saving" | "done">("preview");
  const router = useRouter();

  const onComplete = async () => {
    await supabase
      .from("UserGifRequest")
      .update({
        gifUrl,
        requestStatus: RequestStatusSchema.Enum.SUCCESS
      })
      .eq("id", userGifRequestId);

    setPhase("done");
  }

  return (
    <div className="flex w-full h-full flex-col gap-[1vw] items-center bg-white pb-20">
      {/* TOP BAR */}
      <div className="flex w-full items-center justify-end h-[12vh] px-[4vw] font-text-bold text-black">
        <ExitButton />
      </div>

      {/* CONTENT */}
      <div className="w-full h-full flex-col">
        {phase === "preview" && (
          <PhotoPreview gifUrl={gifUrl ?? ""} onRetake={() => setShowConfirmRetake(true)} onUsePhoto={() => setPhase("saving")} />
        )}
        {phase === "saving" && (
          <SavingAnimationScreen gifUrl={gifUrl ?? ""} onComplete={() => onComplete()} />
        )}
        {phase === "done" && <SavingDoneScreen />}
      </div>
      
      {showConfirmRetake && (
        <ConfirmRetake
          onCancel={() => setShowConfirmRetake(false)}
          onConfirm={() => {
            router.push(`/pledge-a-photo?userGifRequestId=${userGifRequestId}`);
          }}
        />
      )}
    </div>
  );
}
