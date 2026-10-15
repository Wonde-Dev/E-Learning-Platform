import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

/**
 * Lightweight HTML5 video player wrapper.
 * Props: url, title, onEnded
 */
export const VideoPlayer = ({ url, title, onEnded, autoPlay = false }) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    if (!url) return;
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, [url]);

  if (!url) {
    return (
      <div className="aspect-video w-full rounded-xl bg-slate-900 grid place-items-center">
        <div className="text-center text-slate-400">
          <Spinner className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Loading video…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 z-10">
          <Spinner className="h-8 w-8" />
        </div>
      )}
      <video
        ref={ref}
        src={url}
        title={title}
        controls
        playsInline
        autoPlay={autoPlay}
        onEnded={onEnded}
        className="h-full w-full"
      />
    </div>
  );
};