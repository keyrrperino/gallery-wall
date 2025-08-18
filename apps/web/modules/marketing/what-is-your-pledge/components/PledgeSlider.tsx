import "keen-slider/keen-slider.min.css";
import { PledgeStyleEnum } from "../types";
import { cn } from "@ui/lib";
import { PledgeCard } from "./PledgeCard";
import { ReactNode, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";

const ResizePlugin = (slider) => {
  const observer = new ResizeObserver(function () {
    slider.update();
  });

  slider.on("created", () => {
    observer.observe(slider.container);
  });
  slider.on("destroyed", () => {
    observer.unobserve(slider.container);
  });
};

export function PledgeSlider({
  pledges,
  selected,
  onPick,
}: {
  pledges: {
    topText?: ReactNode;
    bottomText?: ReactNode;
    style: PledgeStyleEnum;
  }[];
  selected: PledgeStyleEnum | null;
  onPick: (val: PledgeStyleEnum) => void;
}) {
  const [sliderRef] = useKeenSlider(
    {
      slides: {
        perView: "auto",
        spacing: 0,
      },
      mode: "free-snap",
      renderMode: "precision",
    },
    [ResizePlugin]
  );

  return (
    <div className="overflow-hidden w-full">
      <div ref={sliderRef} className="keen-slider overflow-visible">
        {pledges.map((pledge, i) => (
          <div
            className="keen-slider__slide flex justify-center items-center h-[747px] min-w-[668px] min-h-[747px] max-w-[656px] max-h-[747px]"
            key={i}
          >
            <button
              type="button"
              onClick={() => onPick(pledge.style)}
              className={cn(
                "w-[600px]",
                selected === pledge.style
                  ? "ring-[28px] ring-[#2B90D0]/40"
                  : "ring-0"
              )}
            >
              <PledgeCard
                style={pledge.style}
                topText={pledge.topText}
                bottomText={pledge.bottomText}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
