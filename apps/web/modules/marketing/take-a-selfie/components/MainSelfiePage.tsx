import SimpleButton from "@marketing/home/components/Button";
import React from "react";

interface MainSelfiePageProps {
  onStart: () => void;
}

export default function MainSelfiePage({ onStart }: MainSelfiePageProps) {
  return (
    <div className="flex flex-col items-start bg-white text-blxack h-full w-full px-32">
      <h1 className="text-[130px] font-text-bold uppercase mb-6">
        TAKE A VIDEO SELFIE!
      </h1>
      <p className="mb-2 text-[50px] mb-16">
        Smile, move a little, and let the camera roll 🎥
      </p>
      <p className="mb-2 text-[50px] mb-16">
        We'll capture a short video of you, just a few seconds, to bring your pledge to life as an animated GIF.
      </p>
      <p className="mb-2 text-[50px] mb-16">
        Why a video? It helps us create a more dynamic and expressive pledge photo by using multiple frames to show your energy and support.
      </p>
      <div className="bg-[#f7f0e8] text-[50px] p-10 rounded mt-6 text-[#555]">
        Don't worry, your video is only used to generate the GIF and is not saved or shared. Only the final GIF will appear on the pledge wall and be sent to you.
      </div>
      <SimpleButton
        className="absolute bottom-20 self-center mt-10 text-[75px] text-white py-16 px-80 rounded-full font-bold"
        onClick={onStart}
      >
        TAKE A SELFIE
      </SimpleButton>
    </div>
  );
}
