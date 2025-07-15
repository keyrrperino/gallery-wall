'use client';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  log: true
});

export const convertToGif = async (blob: Blob): Promise<Blob | null> => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(blob));

  await ffmpeg.run(
    '-i',
    'input.mp4',
    '-t',
    '5',
    '-vf',
    'fps=10,scale=320:-1:flags=lanczos',
    'output.gif'
  );

  const data = ffmpeg.FS('readFile', 'output.gif');
  return new Blob([data.buffer], { type: 'image/gif' });
};