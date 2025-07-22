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
      <h2 className="font-text-bold text-[5.5vw] uppercase">
        Here&apos;s your unique pledge photo!
      </h2>

      <div className="flex-grow flex items-center justify-center w-full -mt-[4vh]">
        <div className="w-[30vw] h-[30vw] bg-gray-200 overflow-hidden rounded-md shadow-md">
          <img
            src={gifUrl}
            alt="selfie preview"
            className="w-[30vw] h-[30vw] object-cover"
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
          className="text-[3vw] font-text-bold py-[3vh] px-[9vh] uppercase"
        >
          This looks good!
        </SimpleButton>
      </div>
    </div>
  );
}
