import { ReactNode } from "react";
import { PledgeStyleEnum } from "../types";

// PledgeCard.tsx
export function PledgeCard({
  topText,
  bottomText,
  style,
}: {
  topText?: ReactNode;
  bottomText?: ReactNode;
  style: PledgeStyleEnum;
  active?: boolean;
}) {
  if (style === PledgeStyleEnum.SUPPORT) {
    return (
      <div className="w-[600px] h-[691px] flex flex-col items-center bg-[#cfab88] p-3 leading-none gap-5">
        <div className="bg-[#F7EBDF] h-[75%] w-full"></div>
        <div className="flex flex-col items-center justify-center">
          {topText && (
            <span className="mt-auto text-center text-[90px] text-white font-text-bold">
              {topText}
            </span>
          )}
          {bottomText && (
            <span className="text-center text-[70px] text-white font-text-bold">
              {bottomText}
            </span>
          )}
        </div>
      </div>
    );
  }
  if (style === PledgeStyleEnum.FUTURE) {
    return (
      <div className="w-[600px] h-[691px] relative bg-[#F7EBDF] flex flex-col justify-between gap-3 px-[25px] py-4">
        {topText && (
          <div className="bg-[#728F3D] text-white font-text-bold text-[70px] text-center py-2 px-2 uppercase">
            {topText}
          </div>
        )}
        <div className="bg-[#728F3D] h-[75%] w-full"></div>
        {bottomText && (
          <div className="bg-[#728F3D] text-white font-text-bold text-[55px] text-center py-2 px-2 uppercase">
            {bottomText}
          </div>
        )}
      </div>
    );
  }
  if (style === PledgeStyleEnum.CARE) {
    return (
      <div className="w-[600px] h-[691px] relative bg-blue flex flex-col items-start justify-end p-10">
        <div className="text-white font-text-bold text-center leading-none">
          {topText && <span className="text-[95px]">{topText}</span>}
          {bottomText}
        </div>
      </div>
    );
  }

  return <></>;
}
