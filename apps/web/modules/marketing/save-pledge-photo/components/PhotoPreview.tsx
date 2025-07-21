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
      <h2 className="absolute top-16 font-text-bold text-[130px] uppercase">
        Here&apos;s your unique pledge photo!
      </h2>

      <div className="flex-grow flex items-center justify-center w-full -mt-24">
        <div className="w-[33vw] h-[33vw] bg-gray-200 overflow-hidden rounded-md shadow-md">
          <img
            src={gifUrl}
            alt="selfie preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-16 flex flex-row gap-32">
        <SimpleButton
          onClick={onRetake}
          className="text-[78px] text-[#20409A] font-text-bold bg-transparent uppercase py-16"
        >
          Take Another Selfie
        </SimpleButton>

        <SimpleButton
          onClick={onUsePhoto}
          className="text-[78px] font-text-bold py-16 px-32 uppercase"
        >
          This looks good!
        </SimpleButton>
      </div>
    </div>
  );
}
