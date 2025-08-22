import Image from 'next/image';

export function Background() {
  return (
    <div className="absolute left-0 top-0 h-dvh w-dvw">
      <Image
        src="/images/bg-image1.png"
        alt="BG-1"
        width={526}
        height={625}
        className="absolute left-1/2 top-52 -translate-x-1/2"
      />
      <Image
        src="/images/bg-image2.png"
        alt="BG-2"
        width={341}
        height={345}
        className="absolute -bottom-[90px] -left-[30px]"
      />
      <Image
        src="/images/bg-image3.png"
        alt="BG-3"
        width={337}
        height={373}
        className="absolute -bottom-[10px] right-0"
      />
    </div>
  );
}
