import { useContext, useState } from "react";
import { RoomV2Context } from "../../context/RoomV2Context";
import { UserV2Context } from "../../context/UserV2Context";
import MaximizeIcon from "../../assets/maximize.png";
import { VideoPlayer } from "./VideoPlayer";
import { StreamContext } from "../../context/StreamContext";

export const StreamArea: React.FC = ({}) => {
  const { user } = useContext(UserV2Context);
  const { peers } = useContext(RoomV2Context);
  const { stream } = useContext(StreamContext);

  const [focusedVideoId, setFocusedVideoId] = useState(user?.id);

  return (
    <div className="grid grow grid-flow-row p-7 text-white">
      <div className="relative row-span-4 flex justify-center">
        <div className="relative inline-block aspect-[21/9] h-full">
          {stream && <VideoPlayer stream={stream} />}
          <div className="absolute right-5 top-4">
            <img src={MaximizeIcon} />
          </div>
          <div className="absolute bottom-5 left-5 flex gap-1">
            <span>{user?.name}</span>
            <span>{user?.lastName}</span>
          </div>
        </div>
      </div>
      <div className="row-span-1 grid grid-cols-4 items-center gap-4">
        {Object.values(peers).map((peer) => (
          <div className="relative aspect-[21/9] " key={peer.user?.id}>
            {peer.user?.id === user?.id && stream && (
              <VideoPlayer stream={stream} />
            )}
            {peer.stream && <VideoPlayer stream={peer.stream} />}

            <div className="absolute bottom-5 left-5 flex gap-1">
              <span>{peer?.user?.name}</span>
              <span>{peer?.user?.lastName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
