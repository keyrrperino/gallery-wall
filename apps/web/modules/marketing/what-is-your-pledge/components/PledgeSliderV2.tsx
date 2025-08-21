"use client";

import { PledgeStyleEnum } from "../types";
import { cn } from "@ui/lib";
import { ReactNode, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export function PledgeSliderV2({
  pledges,
  selected,
  onPick,
}: {
  pledges: {
    image: string;
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
                "portrait:w-[600px] portrait:h-[600px] landscape:w-[400px] landscape:h-[400px] embla__slide aspect-square",
                selected === pledge.style
                  ? "ring-[28px] ring-[#2B90D0]/40"
                  : "ring-0"
              )}
            >
              <Image
                src={pledge.image}
                alt="Pledge"
                width={600}
                height={600}
                className="portrait:!w-[600px] portrait:!h-[600px] landscape:!w-[400px] landscape:!h-[400px] aspect-square"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
