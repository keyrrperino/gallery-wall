import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

import { useCallback, useEffect } from 'react';

const defaultImages = [
  '/images/stickers/image-1.webp',
  '/images/stickers/image-2.webp',
  '/images/stickers/image-3.webp',
  '/images/stickers/image-4.webp',
  '/images/stickers/image-5.webp',
];

export function ImageMarquee() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false,
      skipSnaps: true,
      containScroll: false,
      align: 'start',
    },
    [AutoScroll({ playOnInit: true })]
  );

  const images = defaultImages;

  return (
    <div className="pointer-events-none relative w-screen overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex gap-[5vw]">
          {[...images, ...images, ...images].map((src, idx) => (
            <div
              key={idx}
              className="embla__slide flex-[0_0_auto] last:mr-[5vw]"
            >
              <img
                src={src}
                alt=""
                className="w-auto portrait:h-[500px] landscape:h-[400px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
