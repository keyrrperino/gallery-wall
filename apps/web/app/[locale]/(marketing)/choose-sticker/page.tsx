import dynamic from "next/dynamic";

const ShowGif = dynamic(() => import("@marketing/choose-sticker/ShowGif"), { ssr: false });

export default function ChooseStickerPage() {
  return <ShowGif />;
} 