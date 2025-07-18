import { PledgeStyleEnum } from "./Section";

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
      <div className="flex flex-col items-center justify-end bg-[#cfab88] border-4 border-sand w-64 h-72 p-4">
        <div className="mt-auto text-center text-xl text-black font-extrabold">
          {topText}
        </div>
        <div className="text-center text-lg text-black font-extrabold">
          {bottomText}
        </div>
      </div>
    );
  }
  if (style === PledgeStyleEnum.FUTURE) {
    return (
      <div className="relative bg-[#7b9b3a] border-4 border-sand w-64 h-72 flex flex-col justify-between">
        <div className="bg-sand text-[#7b9b3a] font-extrabold text-lg text-center py-2 px-2 uppercase">
          {topText} hleo
        </div>
        <div />
        <div className="bg-sand text-[#7b9b3a] font-extrabold text-base text-center py-2 px-2 uppercase">
          {bottomText}
        </div>
      </div>
    );
  }
  if (style === PledgeStyleEnum.CARE) {
    return (
      <div className="relative bg-blue border-4 border-sand w-64 h-72 flex flex-col justify-end">
        <div className="absolute bottom-6 right-6 text-white text-xl text-right">
          {topText}
          <br />
          <span className="text-base">{bottomText}</span>
        </div>
      </div>
    );
  }

  return <></>
}