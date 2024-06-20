import {
  MicrophoneOffIcon,
  MicrophoneOnIcon,
} from "../icons/stream/Microphone";
import { VideoOffIcon, VideoOnIcon } from "../icons/stream/Video";

export const Participant: React.FC<{
  picture?: string;
  name?: string;
  lastName?: string;
  micOn?: boolean;
  videoOn?: boolean;
}> = ({ picture, name, lastName, micOn, videoOn }) => {
  return (
    <div
      data-testid="participant"
      className="flex items-center justify-between rounded-full bg-white bg-opacity-80 p-2 dark:bg-darkBlue-900 dark:bg-opacity-100"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <img src={picture} />
        </div>
        <div className="flex gap-1 text-sm text-darkBlue-650 dark:text-blue-100 ">
          <span>{name}</span>
          <span className="hidden lg:block">{lastName}</span>
        </div>
      </div>

      <div className="mr-3 flex gap-3">
        {micOn ? (
          <MicrophoneOnIcon width={22} height={22} className="text-blue-700" />
        ) : (
          <MicrophoneOffIcon width={22} height={22} className="text-red-400" />
        )}

        {videoOn ? (
          <VideoOnIcon width={22} height={22} className="text-blue-700" />
        ) : (
          <VideoOffIcon width={22} height={22} className="text-red-400" />
        )}
      </div>
    </div>
  );
};
