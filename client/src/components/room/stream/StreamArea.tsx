import { useContext, useEffect, useState } from "react";

import { RoomV2Context } from "../../../context/RoomV2Context";
import { FocusedVideoDisplay } from "./FocusedVideoDisplay";
import { SliderVideos } from "./SliderVideos";

export const StreamArea: React.FC = () => {
  const { peers, room } = useContext(RoomV2Context);
  const [focusedPeerId, setFocusedPeerId] = useState<string>();

  useEffect(() => {
    if (!focusedPeerId || !peers[focusedPeerId]?.user?.id) {
      const focusedPeerIdFromPeers =
        Object.keys(peers).find((peerId) => peerId === room?.userId) ||
        Object.keys(peers)[0];

      if (focusedPeerIdFromPeers && peers[focusedPeerIdFromPeers]) {
        setFocusedPeerId(focusedPeerIdFromPeers);
      }
    }
  }, [focusedPeerId, peers, room]);

  const hasPeers = !!Object.values(peers).length;

  const focusedPeer = focusedPeerId ? peers[focusedPeerId] : undefined;

  const remaingPeerLength = Object.keys(peers).filter(
    (peerId) => peerId !== focusedPeerId,
  ).length;

  const hasRemaingPeer = remaingPeerLength > 0;

  const handleSetFocusedVideoPeerId = (peerId?: string) => {
    if (peerId && peers[peerId]) {
      setFocusedPeerId(peerId);
    }
  };

  return (
    <div className="flex h-full min-w-0 grow flex-col">
      <div className="flex h-full flex-col gap-5 overflow-y-auto p-3 text-white">
        {hasPeers && focusedPeer && (
          <>
            <FocusedVideoDisplay focusedPeer={focusedPeer} />
            {hasRemaingPeer && (
              <SliderVideos
                focusedPeerId={focusedPeerId}
                remaingPeerLength={remaingPeerLength}
                handleSetFocusedVideoPeerId={handleSetFocusedVideoPeerId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
