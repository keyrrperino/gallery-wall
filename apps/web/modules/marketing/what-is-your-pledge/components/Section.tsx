import { PledgeSlider } from "./PledgeSlider";
import SimpleButton from "@marketing/home/components/Button";
import { PledgeStyleEnum } from "../types";

const PLEDGES: {
  image: string;
  style: PledgeStyleEnum;
}[] = [
  { image: "/images/frames/Poster 1.svg", style: PledgeStyleEnum.SUPPORT },
  { image: "/images/frames/Poster 2.svg", style: PledgeStyleEnum.FUTURE },
  { image: "/images/frames/Poster 3.svg", style: PledgeStyleEnum.CARE },
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
      <h1 className="text-4xl md:text-[4vw] font-text-bold uppercase leading-[0.75]">
        CHOOSE YOUR PLEDGE FRAME
      </h1>
      <p className="text-base md:text-[2vw] mt-4 mb-[3vw] leading-[1]">
        Tap one to select.
      </p>

      <PledgeSlider pledges={PLEDGES} selected={selected} onPick={handlePick} />

      <SimpleButton
        className="
          absolute bottom-[clamp(40px,7.5vh,160px)] self-center mt-10
          text-[clamp(2rem,3vw,4rem)]
          text-white
          py-[clamp(0.55rem,1.5vw,2rem)]
          px-[clamp(2rem,10vw,12rem)]
          rounded-full font-bold z-10
        "
        disabled={selected === null}
        onClick={() => onContinue(selected)}
      >
        CONTINUE
      </SimpleButton>
    </div>
  );
}
