import { PledgeSlider } from "./PledgeSlider";
import SimpleButton from "@marketing/home/components/Button";
import { PledgeStyleEnum } from "../types";
import clsx from "clsx";

const PLEDGES: {
  image: string;
  style: PledgeStyleEnum;
}[] = [
  { image: "/images/frames/Frame 1.svg", style: PledgeStyleEnum.SUPPORT },
  { image: "/images/frames/Frame 2.svg", style: PledgeStyleEnum.FUTURE },
  { image: "/images/frames/Frame 3.svg", style: PledgeStyleEnum.CARE },
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
    <div className="flex flex-col items-start bg-white text-black h-full w-full px-[5vw]">
      <h1 className="
        text-[3vh] md:text-[4vh]
        font-text-bold uppercase
      ">
        CHOOSE YOUR PLEDGE FRAME
      </h1>
      <p className="text-[3vh] mt-[2vh] mb-[3vh] leading-[1]">
        Tap one to select.
      </p>
      <PledgeSlider pledges={PLEDGES} selected={selected} onPick={handlePick} />

      <SimpleButton
        className={clsx(
          "fixed",
          "mt-5",
          "bottom-[5vh]",
          "self-center",
          "text-white",
          "rounded-full font-bold",
          "pt-[2vh] md:pt-[3vh]",
          "pb-[2vh] md:pb-[3vh]",
          "pr-[11vw]",
          "pl-[11vw]",
          "text-[3vh]"
        )}
        disabled={selected === null}
        onClick={() => onContinue(selected)}
      >
        CONTINUE
      </SimpleButton>
    </div>
  );
}
