import dynamic from "next/dynamic";

const VideoSelfieCapture = dynamic(() => import("@marketing/shoot-your-gif/components/VideoSelfieCapture"), { ssr: false });

export default function ChooseStickerPage() {
  return <VideoSelfieCapture />;
} 