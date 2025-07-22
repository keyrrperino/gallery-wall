"use client";

import SimpleButton from "@marketing/home/components/Button";

export default function PhotoPreview({
  onRetake,
  onUsePhoto,
  gifUrl
}: {
  onRetake: () => void;
  onUsePhoto: () => void;
  gifUrl: string;
}) {
  return (
    <div className="flex w-full h-full flex-col items-center bg-white relative">
      <h1 className="text-4xl md:text-[4vw] text-center font-text-bold uppercase leading-[0.75]">
        Here&apos;s your unique pledge photo!
      </h1>

      <div className="flex-grow flex items-center justify-center w-full">
        <div className="relative aspect-square w-[50vw] md:w-auto md:h-[50vh] bg-gray-200 overflow-hidden shadow-md">
          <img
            src={gifUrl}
            alt="selfie preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-row gap-[5vw]">
        <SimpleButton
          onClick={onRetake}
          className="bottom-[clamp(40px,7.5vh,160px)] mt-10
          text-[clamp(2rem,3vw,4rem)]
          hover:text-[#42639F] text-[#20409A] bg-transparent
          py-[clamp(0.55rem,1.5vw,2rem)]
          px-[2vw]
          rounded-full font-text-bold z-10 mb-[3vh]"
        >
          Take Another Selfie
        </SimpleButton>

        <SimpleButton
          onClick={onUsePhoto}
          className="bottom-[clamp(40px,7.5vh,160px)] mt-10
          text-[clamp(2rem,3vw,4rem)]
          text-white
          py-[clamp(0.55rem,1.5vw,2rem)]
          px-[2vw] hover:bg-[#42639F]
          rounded-full font-text-bold z-10 mb-[3vh]"
        >
          This looks good!
        </SimpleButton>
      </div>
    </div>
  );
}
