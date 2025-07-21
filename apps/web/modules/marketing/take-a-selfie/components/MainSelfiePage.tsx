import SimpleButton from "@marketing/home/components/Button";
import React from "react";

type MainSelfiePagePropsType = {
  onStart: () => void;
}

export default function MainSelfiePage({ onStart }: MainSelfiePagePropsType) {
  return (
    <div className="flex flex-col items-start bg-white text-black h-full w-full px-[5vw]">
      <h1 className="text-4xl md:text-[4vw] font-text-bold uppercase leading-[0.75]">
        TAKE A VIDEO SELFIE!
      </h1>
      <p className="text-base md:text-[2vw] mt-4 mb-[0.5vw] leading-[1]">
        Smile, move a little, and let the camera roll 🎥
      </p>
      <p className="text-base md:text-[2vw] mt-4 mb-[0.5vw] leading-[1]">
        We&apos;ll capture a short video of you, just a few seconds, to bring your pledge to life as an animated GIF.
      </p>
      <p className="text-base md:text-[2vw] mt-4 mb-[0.5vw] leading-[1]">
        Why a video? It helps us create a more dynamic and expressive pledge photo by using multiple frames to show your energy and support.
      </p>
      <div className="bg-[#f7f0e8] text-base md:text-[2vw] p-4 md:p-10 rounded mt-6 text-[#555] leading-[1]">
        Don&apos;t worry, your video is only used to generate the GIF and is not saved or shared. Only the final GIF will appear on the pledge wall and be sent to you.
      </div>
      <SimpleButton
          className="
            absolute bottom-[clamp(40px,7.5vh,160px)] self-center mt-10
            text-[clamp(2rem,3vw,4rem)]
            text-white
            py-[clamp(0.55rem,1.5vw,2rem)]
            px-[clamp(2rem,10vw,12rem)]
            rounded-full font-bold z-10
          "
          onClick={onStart}
      >
        TAKE A SELFIE
      </SimpleButton>
    </div>
  );
}
