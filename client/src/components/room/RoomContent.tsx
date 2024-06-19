import { useContext, useEffect } from "react";

import { ChatContext } from "../../context/ChatContext";
import { RoomSiderbar } from "./RoomSiderbar";
import { StreamArea } from "./stream/StreamArea";

export const RoomContent: React.FC = () => {
  const { chat, menuRef, toggleChat } = useContext(ChatContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const inputRef = menuRef.chatInput?.current;
      const chatRef = menuRef.chat?.current;

      if (!inputRef && !chatRef) return;

      if (
        inputRef &&
        !inputRef.contains(event.target as Node) &&
        chatRef &&
        !chatRef.contains(event.target as Node)
      ) {
        toggleChat();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {chat.isChatOpen && (
        <div className="absolute inset-0 z-30 block h-screen w-full bg-black bg-opacity-20 md:hidden"></div>
      )}
      <div className="flex flex-col overflow-hidden">
        <div className="relative flex h-full">
          <StreamArea />
          <RoomSiderbar />
        </div>
      </div>
    </>
  );
};
