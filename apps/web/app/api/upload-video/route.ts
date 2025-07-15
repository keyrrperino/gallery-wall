import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { writeFile, unlink } from 'fs/promises';

// Set ffmpeg path for fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath!);

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'gifs';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save uploaded video to temp file
    const videoBuffer = Buffer.from(await file.arrayBuffer());
    const videoExt = file.name.split('.').pop() || 'mp4';
    const videoPath = join(tmpdir(), `${randomUUID()}.${videoExt}`);
    await writeFile(videoPath, videoBuffer);

    // Prepare temp path for GIF
    const gifFilename = `${randomUUID()}.gif`;
    const gifPath = join(tmpdir(), gifFilename);

    // Convert video to GIF using ffmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          '-t 5', // limit to 5 seconds
          '-vf', 'fps=10,scale=320:-1:flags=lanczos',
        ])
        .toFormat('gif')
        .on('end', resolve)
        .on('error', reject)
        .save(gifPath);
    });

    // Read GIF buffer
    const gifBuffer = await import('fs').then(fs => fs.readFileSync(gifPath));

    // Upload GIF to Supabase Storage
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(gifFilename, gifBuffer, {
        contentType: 'image/gif',
        upsert: true,
      });
    if (error) {
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(gifFilename);

    // Clean up temp files
    await unlink(videoPath);
    await unlink(gifPath);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
} 