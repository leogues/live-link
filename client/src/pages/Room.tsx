import { useContext, useEffect } from "react";

import { ws } from "../services/ws";
import { UserV2Context } from "../context/UserV2Context";
import { RoomV2Context } from "../context/RoomV2Context";

import inviteUser from "../assets/userAdd.svg";
import minimizarIcon from "../assets/setaCima.svg";

import { StreamArea } from "../components/stream/StreamArea";

import { Button } from "../components/common/Button";

import { ChatContext } from "../context/ChatContext";
import { Participant } from "../components/Partipant";
import { Chat } from "../components/chat/Chat";

import { RoomHeader } from "../components/room/RoomHeader";
import { RoomFooter } from "../components/room/RoomFooter";

export const Room = () => {
  const { room, peers } = useContext(RoomV2Context);
  const { user } = useContext(UserV2Context);
  const { chat } = useContext(ChatContext);

  const handleMinimizar = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;

    const divMinimize = button.closest("[aria-expanded]");

    if (!divMinimize) return;

    const ariaExpanded = divMinimize.getAttribute("aria-expanded");

    const isExpanded = ariaExpanded === "true";

    divMinimize.setAttribute("aria-expanded", String(!isExpanded));
  };

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
      <RoomHeader room={room} peers={peers} user={user} />
      <div className="flex flex-col overflow-hidden">
        <div className="flex h-full">
          {/* Left */}
          <div className="flex h-full min-w-0 grow flex-col">
            <StreamArea />
          </div>
          {/* Right */}
          {chat.isChatOpen && (
            <div className=" flex w-[24rem] shrink-0 flex-col border-l border-[#EDF0F6] bg-gray-100 shadow-md dark:border-[#1F2335] dark:bg-darkBlue-600">
              <div
                className="group flex flex-col aria-expanded:min-h-[40%] aria-expanded:flex-1"
                aria-expanded="true"
              >
                <header className="flex h-14 items-center justify-between border-b border-[#EDF0F6] bg-white px-6 py-2 text-gray-900 dark:border-[#1F2335] dark:bg-darkBlue-900 dark:text-white">
                  <span>Participantes</span>
                  <div className="flex gap-2">
                    <Button className="flex gap-2 bg-blue-50 px-5 py-[0.6rem] text-blue-800 hover:brightness-95 dark:bg-darkBlue-400 dark:text-blue-700 dark:hover:brightness-110">
                      <span className="text-sm">Convidar</span>
                      <img width={18} src={inviteUser} />
                    </Button>
                    <Button className="p-1" onClick={handleMinimizar}>
                      <img
                        className="rotate-180 group-aria-[expanded=true]:rotate-0"
                        src={minimizarIcon}
                      />
                    </Button>
                  </div>
                </header>
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
                          videoOn={peer.isSharingScreenOn ?? peer.isWebCamOn}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                className="group aria-expanded:min-h-[60%] aria-expanded:flex-1"
                aria-expanded="true"
              >
                <header className="flex h-14 items-center justify-between bg-white px-6 py-2 text-gray-900 dark:bg-darkBlue-900 dark:text-white">
                  <span>Chat</span>
                  <div className="flex gap-2">
                    <Button className="p-1" onClick={handleMinimizar}>
                      <img
                        className="rotate-180 group-aria-[expanded=true]:rotate-0"
                        src={minimizarIcon}
                      />
                    </Button>
                  </div>
                </header>
                <Chat />
              </div>
            </div>
          )}
        </div>
      </div>
      <RoomFooter chat={chat} />
    </div>
  );
};
