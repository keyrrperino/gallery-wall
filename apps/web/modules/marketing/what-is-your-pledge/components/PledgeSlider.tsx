import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { PledgeStyleEnum } from "../types";

export function PledgeSlider({
  pledges,
  selected,
  onPick,
}: {
  pledges: { image: string; style: PledgeStyleEnum }[];
  selected: PledgeStyleEnum | null;
  onPick: (val: PledgeStyleEnum) => void;
}) {
  return (
    <div
      className="w-full max-h-[1/3] grid grid-cols-2 md:grid-cols-3 gap-[3vw]"
    >
      {pledges.map((pledge, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(pledge.style)}
          className={`relative aspect-square overflow-hidden transition-all duration-300
            ${selected === pledge.style ? "ring-4 md:ring-[1vw] ring-blue-500" : ""}
          `}
        >
          <Image
            src={pledge.image}
            alt={`Pledge ${i + 1}`}
            fill
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
}
