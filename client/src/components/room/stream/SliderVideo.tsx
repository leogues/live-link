import { useContext, useMemo } from "react";

import { StreamContext } from "../../../context/StreamContext";
import { UserV2Context } from "../../../context/UserV2Context";
import { IPeerState } from "../../../reducers/peersReducer";
import { Button } from "../../common/Button";
import { UserMicrophoneVideoToggle } from "../../UserMicrophoneVideoToggle";
import { Label } from "./Label";
import { VideoPlayer } from "./VideoPlayer";
import {
  MicrophoneOnIcon,
  MicrophoneOffIcon,
} from "../../../icons/stream/Microphone";

export const SliderVideo: React.FC<{
  peer: IPeerState;
  focusedPeerId?: string;
  handleSetFocusedVideoPeerId: (peerId?: string) => void;
}> = ({ peer, focusedPeerId, handleSetFocusedVideoPeerId }) => {
  const { localStream } = useContext(StreamContext);
  const { user } = useContext(UserV2Context);

  if (peer.user?.id === focusedPeerId) {
    return null;
  }

  const videoOn = peer.isWebCamOn || peer.isSharingScreenOn;
  const stream = useMemo<MediaStream | undefined>(() => {
    if (peer.user?.id === user?.id) {
      return localStream.current;
    }

    return peer.stream;
  }, [localStream, peer]);

  const isMyVideo = peer.user?.id === user?.id;

  return (
    <Button
      testid="peer-video"
      className="slider-item relative flex h-full shrink-0 justify-center  rounded-xl bg-black"
      onClick={() => handleSetFocusedVideoPeerId(peer.user?.id)}
      key={peer.user?.id}
    >
      {stream && videoOn && <VideoPlayer stream={stream} muted={isMyVideo} />}

      <div className="absolute bottom-5 right-5 z-10">
        <UserMicrophoneVideoToggle bg="toggle" toggle={peer.isMicOn}>
          {peer.isMicOn ? (
            <MicrophoneOnIcon width={17} height={17} />
          ) : (
            <MicrophoneOffIcon width={17} height={17} />
          )}
        </UserMicrophoneVideoToggle>
      </div>

      {!videoOn && (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
          <div className="h-14 w-14 overflow-hidden rounded-full">
            <img src={peer.user?.picture} />
          </div>
        </div>
      )}

      <div className="absolute bottom-5 left-5 z-10">
        <Label size="sm">
          <span>{peer?.user?.name}</span>
          <span>{peer?.user?.lastName}</span>{" "}
        </Label>
      </div>
    </Button>
  );
};
