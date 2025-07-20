"use client";

import * as React from "react";
import { apiClient } from "@shared/lib/api-client";
import { v4 as uuid } from "uuid";
import { Frame, FrameStatusSchema } from "../../../../../../packages/database";

export default function VideoSelfieCapture() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = React.useState(false);
  const [stream, setStream] = React.useState<any>(null);
  const [videoFrames, setVideoFrames] = React.useState<Blob[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [gifUrl, setGifUrl] = React.useState<string | null>(null);
  const [countInSecs, setCountInSecs] = React.useState(0);
  const [doneFrames, setDoneFrames] = React.useState<Frame[]>([]);

  const getSignedUploadUrlMutation = apiClient.uploads.signedUploadUrlGifs.useMutation();
  const getSupabaseSignedUrlMutation = apiClient.uploads.supabaseSignedUrl.useMutation();
  const addFrameMutation = apiClient.frames.addFrame.useMutation();

  React.useEffect(() => {
    const timer = setTimeout(() => setCountInSecs(countInSecs + 1), 1000);
    return () => clearTimeout(timer);
  }, [recording, countInSecs]);


  // Record 3 seconds
  const handleRecord2 = async () => {
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
        console.log(e.data);
        chunks.push(e.data);
      }
    };
    recorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      setPreviewUrl(URL.createObjectURL(videoBlob));
      // await uploadVideoAndProcess(videoBlob);
    };
    recorder.start();
    setTimeout(() => {
      recorder.stop();
      setRecording(false);
    }, 2000);
  };

  const handleRecord = async () => {
    stream.on('data', (chunk: Buffer) => {
      console.log(chunk);
    })    
  }

  const handleRecordV3 = async () => {
    const frames: Blob[] = await captureFramesFromStream(stream, 2, 30) as Blob[];
    // Now upload frames to Supabase as before
    // setVideoFrames(frames as Blob[]);

    const formData = new FormData();
    frames.forEach((blob, i) => {
      formData.append("files", blob, `frame-${i + 1}.webp`);
    });

    console.log(formData);

    fetch("http://127.0.0.1:5001/pub-coastal/us-central1/uploadFile", {
      method: "POST",
      body: formData,
    })

    // const base64Frames = await Promise.all(frames.map(blobToBase64));

    // console.log(base64Frames);
    // uploadFrames(frames as Blob[]);
  };

  async function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function captureFramesFromStream(stream, duration = 2, fps = 30) {
    return new Promise(async (resolve) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();
  
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx: any = canvas.getContext("2d");
  
      const frames: any = [];
      let count = 0;
      const totalFrames = duration * fps;
  
      const interval = setInterval(async () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((res) =>
          canvas.toBlob(res, "image/webp", 1  )
        );
        if (blob) frames.push(blob);
        count++;
        if (count >= totalFrames) {
          clearInterval(interval);
          video.pause();
          resolve(frames);
        }
      }, 1000 / fps);
    });
  }

  const uploadFrames = (frames: Blob[]) => {
    const userId = "1";
    const userGifRequestId = "1";
    frames.forEach((blob, i) => {
      const path = `frames/${
        userId}/${userGifRequestId}/${i+1}.webp`;
      const bucket = "gifs";
      // Get signed upload URL
      getSignedUploadUrlMutation.mutateAsync({
        path,
        bucket,
      }).then((uploadUrl) => {
        fetch(uploadUrl, {
          method: "PUT",
          body: blob,
          headers: {
            "Content-Type": "image/webp",
          },
        }).then((signedUrl) => {
          const id = `${userId}${userGifRequestId}${i+1}`;
          addFrameMutation.mutateAsync({
            userGifRequestId: "1",
            userId: "1",
            frameNumber: `${i + 1}`,
            imageUrl: signedUrl.url,
            frameStatus: FrameStatusSchema.Enum.SUCCESS
          }).then(() => {
            setDoneFrames((oldFrame) => [...oldFrame, {
              id,
              userGifRequestId: userGifRequestId,
              imageUrl: signedUrl.url,
              frameStatus: FrameStatusSchema.Enum.SUCCESS,
              createdAt: new Date(),
              updatedAt: new Date()
            }])
          });
        });
      })
    });
  }

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
    let streamPartial: MediaStream;
    void (async () => {
      try {
        streamPartial = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = streamPartial;
        }
        setStream(streamPartial);
      } catch (e) {
        setError("Unable to access camera. Please allow camera access.");
      }
    })();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
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
      <h1>{countInSecs} Frame Done: {doneFrames.length}</h1>
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