import { motion } from "framer-motion";
import { useRef, useState } from "react";

const defaultImages = [
  "/images/stickers/image 1.png",
  "/images/stickers/image 2.png",
  "/images/stickers/image 3.png",
  "/images/stickers/image 4.png",
  "/images/stickers/image 5.png",
  "/images/stickers/image 6.png",
  "/images/stickers/image 7.png",
  "/images/stickers/image 8.png",
  "/images/stickers/image 9.png",
  "/images/stickers/image 10.png",
];

export function ImageMarquee() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [controls, setControls] = useState({ x: 0 });

  const images = defaultImages;
  return (
    <div className="relative w-full overflow-hidden pt-[3vh]">
      <motion.div
        ref={rowRef}
        animate={controls}
        className="flex gap-[5vw] w-max"
        style={{ x: 0 }}
      >
        {[...images, ...images].map((src, idx) => (
          <img key={idx} src={src} alt="" className="h-[20vh] w-auto" />
        ))}
      </motion.div>
    </div>
  );
}
