"use client";

import { Suspense } from "react";
import GifPreviewSection from "@marketing/gif-preview/components/GifPreviewSection";

export default function GifPreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen bg-white">
        <GifPreviewSection />
      </div>
    </Suspense>
  );
}
