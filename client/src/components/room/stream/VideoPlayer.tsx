import clsx from "clsx";
import { useEffect, useRef } from "react";

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
      className={clsx("h-full w-full", className)}
      ref={videoRef}
      autoPlay
      muted={muted}
    />
  );
};
