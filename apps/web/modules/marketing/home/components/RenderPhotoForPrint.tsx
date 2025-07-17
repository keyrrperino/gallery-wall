
"use client";

import { useUser } from "@saas/auth/hooks/use-user";

export function RenderPhotoForPrint() {

  const { imageUrlWithFrameData } = useUser();

  console.log({ imageUrlWithFrameData })

  return imageUrlWithFrameData.imageUrlWithFrame && (
    <img src={imageUrlWithFrameData.imageUrlWithFrame} alt="Generated With Frame" id="printable" />
  );
}
