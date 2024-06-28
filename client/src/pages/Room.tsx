import { useContext, useEffect } from "react";

import { RoomContent } from "../components/room/RoomContent";
import { RoomFooter } from "../components/room/RoomFooter";
import { RoomHeader } from "../components/room/RoomHeader";
import { RoomInfoEntry } from "../components/room/RoomInfoEntry";
import { UserV2Context } from "../context/UserV2Context";
import { useThisRoom } from "../hooks/useRoom";
import { useIsEnteredRoom } from "../hooks/useRoomStore";
import { ws } from "../services/ws";

export const Room = () => {
  const { data: room, isLoading: roomIsLoading } = useThisRoom();
  const { isLoading: userIsLoading } = useContext(UserV2Context);
  const isEnteredRoom = useIsEnteredRoom();
  console.log("re-render Room");

  useEffect(() => {
    if (room && isEnteredRoom) {
      ws.emit("join-room", {
        roomId: room?.id,
      });

      return () => {
        ws.emit("leave-room", { roomId: room.id });
      };
    }
  }, [room, isEnteredRoom]);

  //TODO: Chrome autoplay videos https://developer.chrome.com/blog/autoplay/
  if (userIsLoading || roomIsLoading) return <div>Loading...</div>;
  if (!isEnteredRoom) return <RoomInfoEntry />;

  return (
    <div className="grid h-[100dvh] max-h-[100dvh] grid-rows-[3rem_1fr_4rem] font-medium text-white lg:grid-rows-[6rem_1fr_8rem]">
      <RoomHeader />
      <RoomContent />
      <RoomFooter />
    </div>
  );
};
