"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
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
import { Button } from "./button";

export default function MainSlider() {
  // SLIDE STATE
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : "?";
  const [slide, setSlide] = useState(1);
  const totalSlides = 3;

  // DATA STATE
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [selectedPledge, setSelectedPledge] = useState<PledgeStyleEnum | null>(
    null
  );
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [userGifRequestId, setUserGifRequestId] = useState<string | null>(null);

  const router = useRouter();
  const progress = (slide / totalSlides) * 100;

  const handleBack = () => {
    if (slide === 1) {
      router.push("/" + additionUrl);
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

  const handleTakeASelfie = async () => {
    const data = await supabase
      .from("UserGifRequest")
      .insert([
        {
          requestStatus: RequestStatusSchema.enum.PENDING,
          userId: "1",
          createdAt: new Date().toISOString(), // optional if your DB has a default
        },
      ])
      .select("id");

    const userGifRequests = data.data ?? [];
    if (data.status === 201 && userGifRequests?.length > 0) {
      setUserGifRequestId(userGifRequests[0].id as string);
      setIsCameraMode(true);
    }
  };

  const onGenerateGIF = async (gifUrl: string, videoUrl: string) => {
    await supabase
      .from("UserGifRequest")
      .update({
        requestStatus: RequestStatusSchema.Enum.PROCESSING,
        gifUrl,
      })
      .eq("id", userGifRequestId);

    router.push(
      `/enter-pin-code${additionUrl}&videoUrl=${videoUrl}&gif=${gifUrl}&userGifRequestId=${userGifRequestId}`
    );
  };

  // When we reach slide 3, log both (only once on transition)
  if (slide === 3) {
    console.log("✅ FINAL SELECTION");
    console.log("Selected Feelings:", selectedFeelings);
    console.log("Selected Pledge:", selectedPledge);
    console.log("Selected userGifRequestId:", userGifRequestId);
  }

  if (isCameraMode) {
    return (
      <SelfieCameraMode
        onExit={() => setIsCameraMode(false)}
        onGenerateGIF={onGenerateGIF}
        pledge={selectedPledge ?? "support"}
        userGifRequestId={userGifRequestId ?? ""}
      />
    );
  }

  const slides = {
    1: (
      <div className="flex flex-col gap-9">
        <h1 className="font-text-bold font-bold text-[80px] uppercase -tracking-[1.6px] leading-[100%]">
          HOW DO YOU FEEL ABOUT COASTAL PROTECTION IN SINGAPORE NOW?
        </h1>
        <p className="text-2xl text-black/70 leading-[150%]">
          Select up to 3 that apply.
        </p>
      </div>
    ),
    2: <></>,
    3: null,
  };

  return (
    <div className="relative h-screen w-screen bg-white text-black flex flex-col">
      {/* TOP BAR */}
      <div className="flex w-full flex-col  justify-between gap-8 p-10">
        <ProgressBar value={progress} />
        <Button onClick={handleBack} variant="ghost" size="icon" asChild>
          <ChevronLeftIcon
            strokeWidth={4}
            className="!text-black hover:text-gray-600 w-12 h-12"
          />
        </Button>
      </div>
      <div className="px-10">{slides[slide]}</div>

      {/* SLIDER CONTENT */}
      <div className="relative w-full overflow-y-scroll overflow-x-hidden lg:overflow-hidden h-full">
        <AnimatePresence mode="wait">
          {slide === 1 && (
            <motion.div
              key="feelings"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full pb-20"
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
              className="absolute top-0 left-0 w-full h-full pb-20"
            >
              <PickAFrame
                onContinue={handlePledgeContinue}
                onPledgeChange={(pledge: PledgeStyleEnum | null) =>
                  setSelectedPledge(pledge)
                }
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
              className="absolute top-0 left-0 w-full h-full pb-20"
            >
              <MainSelfiePage onStart={() => handleTakeASelfie()} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
