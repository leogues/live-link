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

export const StreamArea: React.FC = ({}) => {
  const { user } = useContext(UserV2Context);
  const { peers } = useContext(RoomV2Context);
  const { localStream } = useContext(StreamContext);

  const [focusedVideoId, setFocusedVideoId] = useState(user?.id);

  return (
    <div className="flex h-full flex-col gap-7 p-7 text-white">
      {!!Object.values(peers).length && (
        <>
          <div className="box-border flex h-[70%] justify-center">
            <div className="relative flex aspect-[21/9] h-full max-h-full justify-center bg-black">
              {localStream && <VideoPlayer stream={localStream} />}
              <div className="absolute right-5 top-4">
                <ParticipantCard padding="rounded">
                  <img height={20} width={20} src={MaximizeIcon} />
                </ParticipantCard>
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
          <div className="box-border h-[30%]">
            <div className="vertical-scroll-bar flex h-full gap-5">
              {Object.values(peers).map((peer) => (
                <div
                  className="relative flex aspect-[16/9] h-full justify-center overflow-hidden bg-black"
                  key={peer.user?.id}
                >
                  {peer.user?.id === user?.id && localStream && (
                    <VideoPlayer stream={localStream} />
                  )}
                  {peer.stream && <VideoPlayer stream={peer.stream} />}

                  <div className="absolute bottom-5 right-5">
                    <UserMicrophoneVideoToggle
                      bg="toggle"
                      toggle={peer.isMuted}
                    >
                      <img
                        height={17}
                        width={17}
                        src={peer.isMuted ? MicOffIcon : MicOnIcon}
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
