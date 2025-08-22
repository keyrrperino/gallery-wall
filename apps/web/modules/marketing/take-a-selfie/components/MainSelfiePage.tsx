import SimpleButton from '@marketing/home/components/Button';
import { cn } from '@ui/lib';
import React from 'react';

type MainSelfiePagePropsType = {
  onStart: () => void;
};

export default function MainSelfiePage({ onStart }: MainSelfiePagePropsType) {
  return (
    <div className="flex h-full w-full flex-col items-start justify-between bg-white px-[5vw] text-black">
      <div className="flex w-full flex-col gap-9">
        <h1 className="font-text-bold text-[80px] uppercase leading-[1] -tracking-[1.6px]">
          TAKE A VIDEO SELFIE!
        </h1>
        <p className="text-2xl leading-[1.5] text-black/70">
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

      <div className="flex w-full flex-col items-center justify-center">
        <SimpleButton
          className="w-[400px] items-center justify-center self-center rounded-full py-[26px] text-[32px] font-bold text-white"
          onClick={onStart}
        >
          TAKE A SELFIE
        </SimpleButton>
        <p className="font-text-regular mt-4 w-full rounded-2xl bg-[#f7f0e8] p-5 text-center text-lg leading-[1] text-black/60">
          Don&apos;t worry, your video is only used to generate the GIF and is
          not saved or
          <br /> shared. Only the final GIF will appear on the pledge wall and
          be sent to you.
        </p>
      </div>
    </div>
  );
}
