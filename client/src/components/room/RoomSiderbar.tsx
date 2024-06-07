import { useContext } from "react";

import { ChatContext } from "../../context/ChatContext";
import { ChatSidebar } from "./ChatSidebar";
import { ParticipantsListSidebar } from "./ParticipantsListSidebar";

export const RoomSiderbar: React.FC = () => {
  const { chat } = useContext(ChatContext);

  const handleMinimizar = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;

    const divMinimize = button.closest("[aria-expanded]");

    if (!divMinimize) return;

    const ariaExpanded = divMinimize.getAttribute("aria-expanded");

    const isExpanded = ariaExpanded === "true";

    divMinimize.setAttribute("aria-expanded", String(!isExpanded));
  };

  return (
    <>
      {chat.isChatOpen && (
        <div className=" flex w-[24rem] shrink-0 flex-col border-l border-[#EDF0F6] bg-gray-100 shadow-md dark:border-[#1F2335] dark:bg-darkBlue-600">
          <ParticipantsListSidebar handleMinimizar={handleMinimizar} />
          <ChatSidebar handleMinimizar={handleMinimizar} />
        </div>
      )}
    </>
  );
};
