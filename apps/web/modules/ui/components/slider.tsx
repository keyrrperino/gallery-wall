"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import HowDoYouFeelSection from "@marketing/how-do-you-feel/components/Section";
import PickAFrame from "@marketing/what-is-your-pledge/components/Section";
import MainSelfiePage from "@marketing/take-a-selfie/components/MainSelfiePage";
import SelfieCameraMode from "@marketing/take-a-selfie/components/SelfieCameraMode";
import { ProgressBar } from "@marketing/shared/components/ProgressBar";
import ExitButton from "@marketing/shared/components/ExitButton";
import { PledgeStyleEnum } from "@marketing/what-is-your-pledge/types";
import { supabase } from "../../../lib/supabaseClient";
import { RequestStatusSchema } from "../../../../../packages/database";

export default function MainSlider() {
  // SLIDE STATE
  const [slide, setSlide] = useState(1);
  const totalSlides = 3;

  // DATA STATE
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [selectedPledge, setSelectedPledge] = useState<PledgeStyleEnum | null>(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [userGifRequestId, setUserGifRequestId] = useState<string | null>(null);

  const router = useRouter();
  const progress = (slide / totalSlides) * 100;

  const handleBack = () => {
    if (slide === 1) {
      router.push("/");
    } else {
      setSlide(slide - 1);
    }
  };

  // CONTINUE FROM FEELINGS SECTION
  const handleFeelingsContinue = (feelings: string[]) => {
    setSelectedFeelings(feelings);
    setSlide(2);
  };

  // CONTINUE FROM PLEDGE SECTION, ONLY FOR TESTING IF FEELINGS AND PLEDGE IS SELECTED
  const handlePledgeContinue = (pledge: PledgeStyleEnum | null) => {
    if (pledge) {
      setSelectedPledge(pledge);
      setSlide(3);
      console.log("🎉 Selected feelings:", selectedFeelings);
      console.log("🎉 Selected pledge:", pledge);
    }
  };

  const handleTakeASelfie = () => {
    supabase
      .from('UserGifRequest')
      .insert([
        {
          requestStatus: RequestStatusSchema.enum.PENDING,
          userId: "1",
          createdAt: new Date().toISOString(), // optional if your DB has a default
        }
      ])
      .select("id")
      .then((data) => {
        const userGifRequests = data.data ?? [];
        if (data.status === 201 && userGifRequests?.length > 0) {
          setUserGifRequestId(userGifRequests[0].id);
          setIsCameraMode(true);
        } else {
          
        }
      });
  }

  const onGenerateGIF = (gifUrl: string, videoUrl: string) => {
    supabase
      .from("UserGifRequest")
      .update({
        requestStatus: RequestStatusSchema.Enum.PROCESSING,
        gifUrl
      })
      .eq("id", userGifRequestId)
      .then(() => {
        router.push(`/enter-pin-code?videoUrl=${videoUrl}&gif=${gifUrl}&userGifRequestId=${userGifRequestId}`);
      });
  }

  // When we reach slide 3, log both (only once on transition)
  if (slide === 3) {
    console.log("✅ FINAL SELECTION");
    console.log("Selected Feelings:", selectedFeelings);
    console.log("Selected Pledge:", selectedPledge);
    console.log("Selected userGifRequestId:", userGifRequestId);
  }
    
  if (isCameraMode) {
    return <SelfieCameraMode
      onExit={() => setIsCameraMode(false)}
      onGenerateGIF={onGenerateGIF}
      pledge={selectedPledge || "suppor"}
    />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white text-black">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-32 py-16 gap-8">
        <button onClick={handleBack}>
          <ChevronLeftIcon
            className="text-black hover:text-gray-600"
            width={120}
            height={120}
          />
        </button>
        <div className="flex-1 mx-4">
          <ProgressBar value={progress} />
        </div>
        <ExitButton />
      </div>

      {/* SLIDER CONTENT */}
      <div className="relative h-[85%] w-full">
        <AnimatePresence mode="wait">
          {slide === 1 && (
            <motion.div
              key="feelings"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <HowDoYouFeelSection
                onContinue={handleFeelingsContinue}
                initialSelected={selectedFeelings}
              />
            </motion.div>
          )}

          {slide === 2 && (
            <motion.div
              key="pickaframe"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <PickAFrame
                onContinue={handlePledgeContinue}
                onPledgeChange={(pledge: PledgeStyleEnum | null) => setSelectedPledge(pledge)}
                selected={selectedPledge}
                />
            </motion.div>
          )}

          {slide === 3 && (
            <motion.div
                key="selfie"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-full"
            >
                <MainSelfiePage
                  onStart={() => handleTakeASelfie()}
                />
            </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
