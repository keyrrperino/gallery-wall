import * as React from "react";

export default function ShowGif() {
  // Get GIF URL from query string
  const [gifUrl, setGifUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const url = params.get("gif");
      setGifUrl(url);
    }
  }, []);

  if (!gifUrl) {
    return <div className="text-center py-8">No GIF found.</div>;
  }

  return (
    <div className="flex flex-col items-center py-8">
      <h2 className="mb-4 text-xl font-bold">Your Selfie GIF</h2>
      <img src={gifUrl} alt="Your Selfie GIF" className="rounded-lg border max-w-xs" />
    </div>
  );
} 