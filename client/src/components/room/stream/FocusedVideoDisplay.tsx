import { useContext, useMemo, useState } from "react";

import MaximizeIcon from "../../../assets/maximize.png";
import MicOffIcon from "../../../assets/micOff.png";
import MicOnIcon from "../../../assets/micOn.png";
import { StreamContext } from "../../../context/StreamContext";
import { UserV2Context } from "../../../context/UserV2Context";
import { IPeerState } from "../../../reducers/peersReducer";
import { Button } from "../../common/Button";
import { UserMicrophoneVideoToggle } from "../../UserMicrophoneVideoToggle";
import { Label } from "./Label";
import { VideoPlayer } from "./VideoPlayer";

export const FocusedVideoDisplay: React.FC<{
  focusedPeer: IPeerState | undefined;
}> = ({ focusedPeer }) => {
  const { user } = useContext(UserV2Context);
  const { localStream } = useContext(StreamContext);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoOn = focusedPeer?.isWebCamOn || focusedPeer?.isSharingScreenOn;

  const stream = useMemo<MediaStream | undefined>(() => {
    if (focusedPeer?.user?.id === user?.id) {
      return localStream.current;
    }

    return focusedPeer?.stream;
  }, [focusedPeer, localStream]);

  const isMyVideo = focusedPeer?.user?.id === user?.id;

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="box-border flex min-h-0 grow justify-center">
      {focusedPeer && (
        <div
          data-testid="focused-peer-video"
          data-fullscreen={isFullscreen}
          className="relative flex aspect-[21/9] h-full max-h-full max-w-full 
justify-center overflow-hidden rounded-xl bg-black data-[fullscreen=true]:fixed 
data-[fullscreen=true]:left-0 data-[fullscreen=true]:top-0 data-[fullscreen=true]:z-50 
data-[fullscreen=true]:h-full data-[fullscreen=true]:w-full data-[fullscreen=true]:rounded-none"
        >
          {/* {focusedPeer.user?.id === user?.id && localStream.current ? (
            <VideoPlayer stream={localStream.current} />
          ) : focusedPeer.stream ? (
            <VideoPlayer stream={focusedPeer.stream} />
          ) : null} */}
          {stream && videoOn && (
            <VideoPlayer stream={stream} muted={isMyVideo} />
          )}

          <div className="absolute right-5 top-4 z-10">
            <Button testid="fullscreen-toggle" onClick={handleFullscreen}>
              <Label padding="rounded">
                <img height={20} width={20} src={MaximizeIcon} />
              </Label>
            </Button>
          </div>
          <div className="absolute bottom-5 left-7 z-10 flex gap-1">
            <Label>
              <span>{focusedPeer.user?.name}</span>
              <span>{focusedPeer.user?.lastName}</span>
            </Label>
          </div>

          {!videoOn && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-20 w-20 overflow-hidden rounded-full">
                <img src={focusedPeer.user?.picture} />
              </div>
            </div>
          )}

          <div className="absolute bottom-5 right-7 z-10">
            <UserMicrophoneVideoToggle bg="toggle" toggle={focusedPeer.isMicOn}>
              <img
                src={focusedPeer.isMicOn ? MicOnIcon : MicOffIcon}
                alt="Microfone status"
              />
            </UserMicrophoneVideoToggle>
          </div>
        </div>
      )}
    </div>
  );
};
