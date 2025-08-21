import SimpleButton from "@marketing/home/components/Button";
import { cn } from "@ui/lib";
import React from "react";

type MainSelfiePagePropsType = {
  onStart: () => void;
};

export default function MainSelfiePage({ onStart }: MainSelfiePagePropsType) {
  return (
    <div className="flex flex-col items-start justify-between bg-white text-black h-full w-full px-[5vw]">
      <div className="w-full flex flex-col gap-9">
        <h1 className="text-[80px] font-text-bold uppercase leading-[1] -tracking-[1.6px]">
          TAKE A VIDEO SELFIE!
        </h1>
        <p className="text-2xl text-black/70 leading-[1.5]">
          Smile, move a little, and let the camera roll 🎥
          <br />
          <br />
          We&apos;ll capture a short video of you, just a few seconds, to bring
          your pledge to life as an animated GIF.
          <br />
          <br />
          Why a video? It helps us create a more dynamic and expressive pledge
          photo by using multiple frames to show your energy and support.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <SimpleButton
          className="self-center text-white rounded-full font-bold py-[26px] text-[32px] items-center justify-center w-[400px]"
          onClick={onStart}
        >
          TAKE A SELFIE
        </SimpleButton>
        <p className="bg-[#f7f0e8] w-full text-lg p-5 mt-4 text-black/60 leading-[1] text-center font-text-regular rounded-2xl">
          Don&apos;t worry, your video is only used to generate the GIF and is
          not saved or
          <br /> shared. Only the final GIF will appear on the pledge wall and
          be sent to you.
        </p>
      </div>
    </div>
  );
}
