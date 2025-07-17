"use client";

import { useUser } from "@saas/auth/hooks/use-user";
import { useEffect } from "react";

export enum PhotoWithFrameState {
  IS_LOADING = "IS_LOADING",
  LOADED = "LOADED"
}

type PhotoWithFrameTypes = {
  imageUrl: string;
  onGenerateFrame: (imageWithFrame: string) => void;
  onStateChange: (state: PhotoWithFrameState) => void;
}

export function PhotoWithFrame(props: PhotoWithFrameTypes) {
  const { setImageUrlWithFrame } = useUser();

  const { imageUrl, onGenerateFrame, onStateChange } = props;

  const getMarginImageBased = (setNo: string) => {
    switch (setNo) {
      case "0":
        return -300;

      case "1":
        return 0;

      case "2":
        return -200;

      default:
        return 0
    }
  }

  useEffect(() => {
    onStateChange && onStateChange(PhotoWithFrameState.IS_LOADING);
    setImageUrlWithFrame({
      imageUrlWithFrame: "",
      imageUrlWithFrameState: PhotoWithFrameState.IS_LOADING
    })

    const imgEle1 = new Image();
    const imgEle2 = new Image();
    const resEle = document.getElementById("printable");

    const setNo = imageUrl.split("?setNo=")[1]
    console.log({ imageUrl });

    const marginTop = getMarginImageBased(setNo);

    console.log({ marginTop })

    imgEle1.onload = () => {
      imgEle2.onload = () => {
        if (resEle instanceof HTMLCanvasElement) {
          const context = resEle.getContext("2d");

          if (context) {
            const aspectRatio = imgEle2.naturalWidth / imgEle2.naturalHeight;
            const aspectRatio2 = imgEle1.naturalWidth / imgEle1.naturalHeight;
            // Calculate the new height to maintain the aspect ratio
            const newHeight = imgEle2.width / aspectRatio;
            const newHeight2 = imgEle2.width / aspectRatio2;

            resEle.width = imgEle2.width;
            resEle.height = newHeight;

            context.globalAlpha = 1;
            context.drawImage(imgEle1, 0, marginTop, imgEle2.width, newHeight2);
            context.globalAlpha = 1;
            context.drawImage(imgEle2, 0, 0);
            const imageUrlBase64FromCanvas = resEle.toDataURL("image/png");
            onGenerateFrame(imageUrlBase64FromCanvas);
            onStateChange && onStateChange(PhotoWithFrameState.LOADED);
            setImageUrlWithFrame({
              imageUrlWithFrame: imageUrlBase64FromCanvas,
              imageUrlWithFrameState: PhotoWithFrameState.LOADED
            })
          }
        }
      };
      imgEle2.src = "/images/ai-frame.png"; // Set the source for imgEle2
    };
    imgEle1.src = `/_next/image?url=${encodeURIComponent(imageUrl)}&w=3840&q=100`;
  }, [
    imageUrl
  ]);

  return (
    <>
    </>
  );
}
