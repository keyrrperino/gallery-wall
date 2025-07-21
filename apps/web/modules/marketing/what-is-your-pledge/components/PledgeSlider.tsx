import "keen-slider/keen-slider.min.css";
import { PledgeCard } from "./PledgeCard";
import { PledgeStyleEnum } from "../types";

export function PledgeSlider({
  pledges,
  selected,
  onPick,
}: {
  pledges: { topText: string; bottomText: string; style: PledgeStyleEnum }[];
  selected: PledgeStyleEnum | null;
  onPick: (val: PledgeStyleEnum) => void;
}) {

  return (
    <div className="w-full flex flex-row h-[40vh] items-center gap-5">
      {pledges.map((pledge, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(pledge.style)}
          className={`flex-1 h-full p-7 rounded-xl ${selected === pledge.style ? "bg-blue/50" : "bg-transparent"} cursor-pointer transition-colors duration-300`}
        >
          <PledgeCard {...pledge} active={selected === pledge.style} />
        </button>
      ))}
    </div>
  );
}
