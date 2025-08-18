import { PledgeSlider } from "./PledgeSlider";
import SimpleButton from "@marketing/home/components/Button";
import { PledgeStyleEnum } from "../types";
import clsx from "clsx";
import { cn } from "@ui/lib";
import { ReactNode } from "react";
import { PledgeSliderV2 } from "./PledgeSliderV2";

const PLEDGES: {
  topText?: ReactNode | string;
  bottomText?: ReactNode | string;
  style: PledgeStyleEnum;
}[] = [
  {
    style: PledgeStyleEnum.PROTECTOR,
    bottomText: (
      <>
        I'M A<br />
        COASTAL PROTECTOR
      </>
    ),
  },
  {
    style: PledgeStyleEnum.FUTURE,
    topText: "I SUPPORT",
    bottomText: "OUR COASTAL FUTURE",
  },
  {
    style: PledgeStyleEnum.CARE,
    bottomText: (
      <>
        <span className="text-[46px]">I STAND</span>
        <br />
        <span className="text-[28px]">FOR STRONG</span>
        <br />
        <span className="text-[46px]">SHORES</span>
      </>
    ),
  },
];

export default function PickAFrame({
  onContinue,
  onPledgeChange,
  selected,
}: {
  onContinue: (pledge: PledgeStyleEnum | null) => void;
  onPledgeChange: (pledge: PledgeStyleEnum | null) => void;
  selected: PledgeStyleEnum | null;
}) {
  const handlePick = (val: PledgeStyleEnum) => {
    onPledgeChange(selected === val ? null : val);
  };

  return (
    <div className="flex flex-col items-start justify-between overflow-hidden bg-white text-black h-full w-full">
      <div className="flex flex-col gap-9 px-10">
        <h1 className="font-text-bold text-[80px] uppercase -tracking-[1.6px] leading-[100%]">
          PICK A FRAME AND YOUR PLEDGE MESSAGE
        </h1>
        <p className="text-2xl text-black/70 leading-[150%]">
          Choose one pledge to appear with your frame!
        </p>
      </div>
      {/* <PledgeSlider pledges={PLEDGES} selected={selected} onPick={handlePick} /> */}
      <PledgeSliderV2
        pledges={PLEDGES}
        selected={selected}
        onPick={handlePick}
      />
      <SimpleButton
        className="self-center text-white rounded-full font-bold py-[26px] text-[32px] items-center justify-center w-[400px] mx-auto"
        disabled={selected === null}
        onClick={() => onContinue(selected)}
      >
        CONTINUE
      </SimpleButton>
    </div>
  );
}
