"use client";

import Image from "next/image";

const images = [
  "/images/stickers/sticker1.svg",
  "/images/stickers/sticker2.svg",
  "/images/stickers/sticker3.svg",
  "/images/stickers/sticker4.svg",
  "/images/stickers/sticker5.svg",
];

export default function StickerCarousel() {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex animate-scroll gap-4">
        {/* Duplicate the images twice for seamless loop */}
        {[...images, ...images].map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-square w-[40vw] md:w-[50vh] flex-shrink-0"
          >
            <Image
              src={src}
              alt={`Sticker ${idx + 1}`}
              fill
              className="object-contain p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
