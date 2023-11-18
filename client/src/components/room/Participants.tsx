import { useContext } from "react";
import { RoomV2Context } from "../../context/RoomV2Context";
import { Participant } from "../Partipant";

export const Participants: React.FC = () => {
  const { peers } = useContext(RoomV2Context);

  return (
    <div className="hidden max-h-[calc(100%-3.5rem)] grow group-aria-[expanded=true]:block">
      <div className=" box-border flex h-full max-h-full flex-col gap-2 overflow-auto p-4">
        {Object.values(peers).map((peer) => {
          return (
            <Participant
              key={`participant-${peer.user?.id}`}
              name={peer.user?.name}
              lastName={peer.user?.lastName}
              picture={peer.user?.picture}
              micOn={peer.isMicOn}
              videoOn={peer.isSharingScreenOn || peer.isWebCamOn}
            />
          );
        })}
      </div>
    </div>
  );
};
