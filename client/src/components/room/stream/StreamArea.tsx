import { useEffect, useState } from "react";

import { useThisRoom } from "../../../hooks/useRoom";
import { useRoomPeers } from "../../../hooks/useRoomStore";
import { FocusedVideoDisplay } from "./FocusedVideoDisplay";
import { SliderVideos } from "./SliderVideos";

export const StreamArea: React.FC = () => {
  const { data: room } = useThisRoom();
  const peers = useRoomPeers();
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
      <div className="grid h-full  grid-rows-[2fr_1fr] flex-col gap-5 overflow-y-auto p-3 text-white">
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
