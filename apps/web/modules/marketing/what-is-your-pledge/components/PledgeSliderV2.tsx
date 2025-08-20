"use client";

import { PledgeStyleEnum } from "../types";
import { cn } from "@ui/lib";
import { PledgeCard } from "./PledgeCard";
import { ReactNode, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

export function PledgeSliderV2({
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  // Update carousel when slides change
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, pledges]);

  // Handle resize observer for responsive updates
  useEffect(() => {
    if (!emblaApi) return;

    const resizeObserver = new ResizeObserver(() => {
      emblaApi.reInit();
    });

    const container = emblaApi.containerNode();
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [emblaApi]);

  const handlePick = (pledge: PledgeStyleEnum) => {
    onPick(pledge);
    emblaApi?.scrollTo(pledges.findIndex((p) => p.style === pledge));
  };

  return (
    <div className="overflow-hidden w-full p-10">
      <div ref={emblaRef} className="embla">
        <div className="embla__container flex gap-10">
          {pledges.map((pledge, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePick(pledge.style)}
              className={cn(
                "w-[600px] embla__slide",
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
          ))}
        </div>
      </div>
    </div>
  );
}
