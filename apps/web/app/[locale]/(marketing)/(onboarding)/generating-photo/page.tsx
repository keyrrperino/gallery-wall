/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';
import LoadingScreen from '@marketing/generating-photo/components/LoadingScreen';

export default function GeneratingPhoto() {
  return (
    <div className="absolute top-0 flex h-screen w-screen">
      <LoadingScreen />
    </div>
  );
}
