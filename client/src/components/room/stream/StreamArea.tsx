import { useContext, useState } from "react";
import { RoomV2Context } from "../../../context/RoomV2Context";

import { FocusedVideoDisplay } from "./FocusedVideoDisplay";
import { SliderVideos } from "./SliderVideos";

export const StreamArea: React.FC = () => {
  const { peers, room } = useContext(RoomV2Context);
  const [focusedPeerId, setFocusedPeerId] = useState<string>();

  const hasPeers = !!Object.values(peers).length;

  if (!focusedPeerId || !peers[focusedPeerId]?.user?.id) {
    const focusedPeerIdFromPeers =
      Object.keys(peers).find((peerId) => peerId === room?.userId) ||
      Object.keys(peers)[0];

    if (focusedPeerIdFromPeers && peers[focusedPeerIdFromPeers]) {
      setFocusedPeerId(focusedPeerIdFromPeers);
    }
  }

  const focusedPeer = focusedPeerId ? peers[focusedPeerId] : undefined;

  const handleSetFocusedVideoPeerId = (peerId?: string) => {
    if (peerId && peers[peerId]) {
      setFocusedPeerId(peerId);
    }
  };

  return (
    <div className="flex h-full min-w-0 grow flex-col">
      <div className="flex h-full flex-col gap-5 p-3 text-white">
        {hasPeers && (
          <>
            <FocusedVideoDisplay focusedPeer={focusedPeer} />
            <SliderVideos
              focusedPeerId={focusedPeerId}
              handleSetFocusedVideoPeerId={handleSetFocusedVideoPeerId}
            />
          </>
        )}
      </div>
    </div>
  );
};
