import Image from "next/image";

export function Background() {
  return (
    <div className="absolute w-dvw h-dvh top-0 left-0">
      <Image
        src="/images/bg-image1.png"
        alt="BG-1"
        width={526}
        height={625}
        className="absolute top-52 left-1/2 -translate-x-1/2"
      />
      <Image
        src="/images/bg-image2.png"
        alt="BG-2"
        width={341}
        height={345}
        className="absolute -left-[30px] -bottom-[90px]"
      />
      <Image
        src="/images/bg-image3.png"
        alt="BG-3"
        width={337}
        height={373}
        className="absolute right-0 -bottom-[10px]"
      />
    </div>
  );
}
