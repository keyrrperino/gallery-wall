import { PledgeSlider } from "./PledgeSlider";
import SimpleButton from "@marketing/home/components/Button";
import { PledgeStyleEnum } from "../types";

const PLEDGES: {
  topText: string;
  bottomText: string;
  style: PledgeStyleEnum;
}[] = [
  { topText: "I SUPPORT", bottomText: "COASTAL PROTECTION", style: PledgeStyleEnum.SUPPORT },
  { topText: "TIDE TO OUR FUTURE", bottomText: "FOR GENERATIONS TO COME", style: PledgeStyleEnum.FUTURE },
  { topText: "I CARE", bottomText: "ABOUT OUR COASTS", style: PledgeStyleEnum.CARE },
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
    <div className="flex flex-col items-start bg-white text-black h-full w-full px-32">
      <h1 className="text-[130px] font-text-bold uppercase mb-6 leading-tight">
        CHOOSE YOUR PLEDGE FRAME
      </h1>
      <p className="text-[50px] mb-20">Tap one to select.</p>

      <PledgeSlider
        pledges={PLEDGES}
        selected={selected}
        onPick={handlePick}
      />

      <SimpleButton
        className="absolute bottom-20 self-center mt-10 text-[75px] text-white py-16 px-80 rounded-full font-bold"
        disabled={selected === null}
        onClick={() => onContinue(selected)}
      >
        CONTINUE
      </SimpleButton>
    </div>
  );
}
