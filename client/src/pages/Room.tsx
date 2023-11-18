import { useContext, useEffect } from "react";

import { ws } from "../services/ws";
import { RoomV2Context } from "../context/RoomV2Context";

import { RoomHeader } from "../components/room/RoomHeader";
import { RoomFooter } from "../components/room/RoomFooter";
import { RoomContent } from "../components/room/RoomContent";

export const Room = () => {
  const { room } = useContext(RoomV2Context);

  useEffect(() => {
    if (room) {
      ws.emit("join-room", {
        roomId: room?.id,
      });

      return () => {
        console.log("leave-room", room.id);
        ws.emit("leave-room", { roomId: room.id });
      };
    }
  }, [room]);

  console.log("re-render");

  return (
    <div className="grid h-screen max-h-screen grid-rows-[6rem_1fr_8rem] font-medium text-white">
      <RoomHeader />
      <RoomContent />
      <RoomFooter />
    </div>
  );
};
