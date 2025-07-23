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
    <div className="flex w-full h-full flex-col items-center bg-white gap-3 relative mr-3 ml-3">
      <h2 className="font-text-bold text-[5.5vh] md:text-[4vw] uppercase mr-3 ml-3">
        Here&apos;s your unique pledge photo!
      </h2>

      <div className="flex-grow flex items-center justify-center w-full -mt-[4vh]">
        <div className="w-[35vh] md:w-[25vw] lg:w-[35vw] h-[35vh] md:h-[25vw] lg:h-[35vw] bg-gray-200 overflow-hidden rounded-md shadow-md">
          <img
            src={gifUrl}
            alt="selfie preview"
            className="w-[35vh] md:w-[25vw] lg:w-[35vw] h-[35vh] md:h-[25vw] lg:h-[35vw] object-cover"
          />
        </div>
      </div>

      <div className="flex flex-row gap-[5vw]">
        <SimpleButton
          onClick={onRetake}
          className="text-[3vw] text-[#20409A] font-text-bold bg-transparent uppercase py-[3vh]"
        >
          Take Another Selfie
        </SimpleButton>

        <SimpleButton
          onClick={onUsePhoto}
          className="text-[3vw] font-text-bold py-[2vh] md:py-[3vh] px-[7vh] md:px-[9vh] uppercase"
        >
          This looks good!
        </SimpleButton>
      </div>
    </div>
  );
}
