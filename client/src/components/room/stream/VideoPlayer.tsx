import { useEffect, useRef } from "react";
import { cn } from "../../../utils/cn";

export const VideoPlayer: React.FC<{
  stream: MediaStream;
  className?: string;
  muted?: boolean;
}> = ({ stream, className, muted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      className={cn(
        "max-h-full max-w-full object-cover object-center",
        className,
      )}
      ref={videoRef}
      autoPlay
      muted={muted}
    />
  );
};
