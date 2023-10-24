import { useContext, useEffect } from "react";

import { ws } from "../services/ws";
import { ChatContext } from "../context/ChatContext";
import { UserV2Context } from "../context/UserV2Context";
import { RoomV2Context } from "../context/RoomV2Context";
import { formatDate } from "../Utils/DateUtils";

import videoCamIcon from "../assets/videoCam.png";
import { Profile } from "../components/Profile";
import { StreamProvider } from "../context/StreamContext";
import { StreamArea } from "../components/stream/StreamArea";
import { ChatButton } from "../components/ChatButton";

export const Room = () => {
  const { room } = useContext(RoomV2Context);
  const { user } = useContext(UserV2Context);
  const { toggleChat } = useContext(ChatContext);

  const createAtFormated = room?.createdAt ? formatDate(room?.createdAt) : "";

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
    <div className="flex h-screen flex-col font-medium ">
      <header className="flex items-center text-white dark:bg-darkBlue-900">
        <div className="min-w-max border-r border-opacity-60 p-4 px-8 dark:border-[#23212194]">
          <img className="block h-16 w-16" src={videoCamIcon} />
        </div>
        <div className="ml-10 flex flex-col">
          <span className="text-2xl text-[#E2E2E2]">{room?.topic}</span>
          <span className="text-[#9F9F9F]">{createAtFormated}</span>
        </div>
        <div className="ml-auto flex basis-[32rem] items-center px-7">
          <div>...............</div>
          <div className="ml-14 grow">
            {user && (
              <Profile
                name={user.name}
                lastName={user.lastName}
                picture={user.picture}
                role={user.id === room?.userId ? "Moderador" : "Participante"}
                fontSize="sm"
                imageSize="sm"
                marginRight="4"
              />
            )}
          </div>
        </div>
      </header>
      <div className="flex grow ">
        {/* Left */}
        <div className="flex grow flex-col">
          <StreamArea />
          <div className="h-8 w-full"></div>

          {/* <div className="fixed bottom-0 flex h-28 w-full items-center justify-center gap-2 border-t-2 p-6 dark:border-0 dark:bg-darkBlue-900">
          <ChatButton onClick={toggleChat} />
        </div> */}
        </div>
        {/* Right */}
        <div className="basis-80">
          <span> test</span>
        </div>
      </div>
    </div>
  );
};
