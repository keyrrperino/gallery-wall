"use client";

import * as React from "react";
import { apiClient } from "@shared/lib/api-client";
import { v4 as uuid } from "uuid";

export default function VideoSelfieCapture() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [gifUrl, setGifUrl] = React.useState<string | null>(null);

  const getSignedUploadUrlMutation = apiClient.uploads.signedUploadUrlGifs.useMutation();
  const getSupabaseSignedUrlMutation = apiClient.uploads.supabaseSignedUrl.useMutation();

  // Record 3 seconds
  const handleRecord = async () => {
    setError(null);
    setRecording(true);
    setLoading(false);
    setPreviewUrl(null);
    const stream = videoRef.current?.srcObject as MediaStream;
    if (!stream) {
      setError("Camera not ready");
      setRecording(false);
      return;
    }
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    recorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      setPreviewUrl(URL.createObjectURL(videoBlob));
      await uploadVideoAndProcess(videoBlob);
    };
    recorder.start();
    setTimeout(() => {
      recorder.stop();
      setRecording(false);
    }, 3000);
  };

  // Upload video to S3, then process to GIF via Firebase Function
  const uploadVideoAndProcess = async (videoBlob: Blob) => {
    setLoading(true);
    setError(null);
    setGifUrl(null);
    try {
      const path = `videos/${uuid()}.webm`;
      const bucket = "gifs";
      // Get signed upload URL
      const uploadUrl = await getSignedUploadUrlMutation.mutateAsync({
        path,
        bucket,
      });

      // Upload the video
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: videoBlob,
        headers: {
          "Content-Type": "video/webm",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }

      // Get the signed URL for the uploaded video (valid for 1 day)
      const { url } = await getSupabaseSignedUrlMutation.mutateAsync({
        bucket,
        path,
        // expiresIn: 86400 // 1 day, optional if default
      });

      // Call Firebase function to process video to GIF

      console.log(url);
      console.log(`https://us-central1-pub-coastal.cloudfunctions.net/convertVideoUrlToGIF?videoUrl=${url}`);

      const firebaseUrl = `https://us-central1-pub-coastal.cloudfunctions.net/convertVideoUrlToGIF?videoUrl=${url}&width=1080`;

      setGifUrl(firebaseUrl);
      // const gifResponse = await fetch(firebaseUrl);
      // if (!gifResponse.ok) throw new Error("Failed to generate GIF");
      // // Assume the function returns a JSON with { gifUrl }
      // const gifData = await gifResponse.json();
      // if (!gifData.gifUrl) throw new Error("GIF URL not found in response");
      // setGifUrl(gifData.gifUrl);
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err?.message || "Upload or processing failed.");
      } else {
        setError("Upload or processing failed.");
      }
      setLoading(false);
    }
  };

  // Start camera on mount
  React.useEffect(() => {
    let stream: MediaStream;
    void (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        setError("Unable to access camera. Please allow camera access.");
      }
    })();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-lg border w-full max-w-xs aspect-video bg-black"
      />
      {error && <div className="text-red-500">{error}</div>}
      {previewUrl && (
        <video
          src={previewUrl}
          controls
          className="rounded-lg border w-full max-w-xs aspect-video"
        >
          <track kind="captions" />
        </video>
      )}
      {gifUrl && (
        <img src={gifUrl} alt="Generated GIF" className="rounded-lg border w-full max-w-xs aspect-video" />
      )}
      <button
        onClick={handleRecord}
        disabled={recording || loading}
        className="px-6 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {recording ? "Recording..." : loading ? "Processing..." : "Record 3s Selfie"}
      </button>
    </div>
  );
} 