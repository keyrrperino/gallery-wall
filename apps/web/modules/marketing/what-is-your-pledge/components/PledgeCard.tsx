import { PledgeStyleEnum } from "../types";

// PledgeCard.tsx
export function PledgeCard({
  topText,
  bottomText,
  style,
}: {
  topText: string;
  bottomText: string;
  style: PledgeStyleEnum;
  active?: boolean;
}) {
  if (style === PledgeStyleEnum.SUPPORT) {
    return (
      <div className="flex flex-col items-center bg-[#cfab88] border-4 border-sand w-full h-full p-10 leading-none gap-5">
        <div className="bg-[#F7EBDF] h-[75%] w-full"></div>
        <div>
          <div className="mt-auto text-center text-[90px] text-white font-text-bold">
            {topText}
          </div>
          <div className="text-center text-[70px] text-white font-text-bold">
            {bottomText}
          </div>
        </div>
      </div>
    );
  }
  if (style === PledgeStyleEnum.FUTURE) {
    return (
      <div className="relative bg-[#F7EBDF] border-4 border-sand w-full h-full flex flex-col justify-between gap-7 p-10">
        <div className="bg-[#728F3D] text-white font-text-bold text-[70px] text-center py-2 px-2 uppercase">
          {topText}
        </div>
        <div className="bg-[#728F3D] h-[75%] w-full"></div>
        <div className="bg-[#728F3D] text-white font-text-bold text-[55px] text-center py-2 px-2 uppercase">
          {bottomText}
        </div>
      </div>
    );
  }
  if (style === PledgeStyleEnum.CARE) {
    return (
      <div className="relative bg-blue border-4 border-sand w-full h-full flex flex-col items-start justify-end p-10">
        <div className="text-white font-text-bold text-center leading-none">
          <span className="text-[95px]">{topText}</span>
          <br />
          <span className="text-[55px]">ABOUT OUR</span>
          <br />
          <span className="text-[82px]">COASTS</span>
        </div>
      </div>
    );
  }

  return <></>
}