import { useContext, useState } from "react";
import { RoomV2Context } from "../../context/RoomV2Context";
import { UserV2Context } from "../../context/UserV2Context";
import MaximizeIcon from "../../assets/maximize.png";
import { VideoPlayer } from "./VideoPlayer";
import { StreamContext } from "../../context/StreamContext";
import { ParticipantCard } from "./ParticipantCard";
import { UserMicrophoneVideoToggle } from "../UserMicrophoneVideoToggle";
import MicOnIcon from "../../assets/micOn.svg";
import MicOffIcon from "../../assets/micOff.svg";
import { Button } from "../common/Button";

export const StreamArea: React.FC = ({}) => {
  const { user } = useContext(UserV2Context);
  const { peers } = useContext(RoomV2Context);
  const { localStream } = useContext(StreamContext);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // const [focusedVideoId, setFocusedVideoId] = useState(user?.id);

  return (
    <div className="flex h-full flex-col gap-5 p-5 text-white">
      {!!Object.values(peers).length && (
        <>
          <div className="box-border flex h-[calc(70%-(1.25rem)*0.70)] justify-center">
            <div
              data-fullscreen={isFullscreen}
              className="relative flex aspect-[21/9] h-full max-h-full max-w-full 
              justify-center bg-black data-[fullscreen=true]:fixed data-[fullscreen=true]:left-0 
              data-[fullscreen=true]:top-0 data-[fullscreen=true]:z-50 data-[fullscreen=true]:h-full 
              data-[fullscreen=true]:w-full data-[fullscreen=true]:bg-black"
            >
              {localStream.current && (
                <VideoPlayer stream={localStream.current} />
              )}
              <div className="absolute right-5 top-4">
                <Button onClick={handleFullscreen}>
                  <ParticipantCard padding="rounded">
                    <img height={20} width={20} src={MaximizeIcon} />
                  </ParticipantCard>
                </Button>
              </div>
              <div className="absolute bottom-5 left-7 flex gap-1">
                <ParticipantCard>
                  <span>{user?.name}</span>
                  <span>{user?.lastName}</span>
                </ParticipantCard>
              </div>

              <div className="absolute bottom-5 right-7">
                <UserMicrophoneVideoToggle bg="toggle" toggle={true}>
                  <img
                    src={true ? MicOffIcon : MicOnIcon}
                    alt="Microfone status"
                  />
                </UserMicrophoneVideoToggle>
              </div>
            </div>
          </div>
          <div className="box-border h-[calc(30%-(1.25rem)*0.30)]">
            <div className="vertical-scroll-bar flex h-full gap-5">
              {Object.values(peers).map((peer) => (
                <div
                  className="relative flex aspect-[16/9] h-full justify-center overflow-hidden bg-black"
                  key={peer.user?.id}
                >
                  {peer.user?.id === user?.id && localStream.current && (
                    <VideoPlayer stream={localStream.current} />
                  )}
                  {peer.stream && <VideoPlayer stream={peer.stream} />}

                  <div className="absolute bottom-5 right-5">
                    <UserMicrophoneVideoToggle
                      bg="toggle"
                      toggle={peer.isMicOn}
                    >
                      <img
                        height={17}
                        width={17}
                        src={peer.isMicOn ? MicOffIcon : MicOnIcon}
                        alt="Microfone status"
                      />
                    </UserMicrophoneVideoToggle>
                  </div>

                  <div className="absolute bottom-5 left-5">
                    <ParticipantCard size="sm">
                      <span>{peer?.user?.name}</span>
                      <span>{peer?.user?.lastName}</span>{" "}
                    </ParticipantCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
