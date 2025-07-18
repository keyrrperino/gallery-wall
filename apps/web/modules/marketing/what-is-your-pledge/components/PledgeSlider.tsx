import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PledgeCard } from "./PledgeCard";
import { PledgeStyleEnum } from "./Section";
import clsx from "clsx";

export function PledgeSlider({
  pledges,
  selected,
  onPick,
}: {
  pledges: { topText: string; bottomText: string; style: PledgeStyleEnum }[];
  selected: string | null;
  onPick: (val: string) => void;
}) {
  const [sliderRef,] = useKeenSlider<HTMLDivElement>({
    mode: "snap",
    slides: () => [
      {
        origin: 0.2,
        size: 0.5,
        spacing: -0.03,
      },
      {
        origin: 0.2,
        size: 0.5,
        spacing: -0.03,
      },
      {
        origin: 0.4,
        size: 0.5,
        spacing: 1,
      },
    ]
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-2 max-w-2xl">
        <div ref={sliderRef} className="keen-slider">
          {pledges.map((pledge, i) => (
            <div
              className={clsx("keen-slider__slide", `number-slide${i+1}`)}
              key={i}
              style={{
              }}
            >
              <div
                onClick={() => onPick(pledge.bottomText)}
                style={{ cursor: "pointer" }}
              >
                <PledgeCard
                  {...pledge}
                  active={selected === pledge.bottomText}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Dots and arrows as before */}
    </div>
  );
}