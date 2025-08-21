"use client";

import { Suspense } from "react";

export default function GifPreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen bg-white" />
    </Suspense>
  );
}
