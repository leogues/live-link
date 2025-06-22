import { useEffect, useRef } from 'react';
import { cn } from '../../../utils/cn';

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
      className={cn('h-full max-h-full w-full max-w-full ', className)}
      ref={videoRef}
      autoPlay
      muted={muted}
    />
  );
};
