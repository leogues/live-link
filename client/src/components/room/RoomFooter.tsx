import { Link } from "react-router-dom";
import { ChatInput } from "../chat/ChatInput";
import { RoomControlButtons } from "./RoomControlButtons";
import { ChatState } from "../../reducers/chatReduces";

export const RoomFooter: React.FC<{ chat: ChatState }> = ({ chat }) => {
  return (
    <footer className="flex flex-shrink-0 grow basis-auto  bg-white dark:bg-darkBlue-900">
      <div className="relative flex h-full grow border border-[#EDF0F6] dark:border-[#1F2335] lg:justify-center">
        <RoomControlButtons chat={chat} />
        <Link
          to=".."
          className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full bg-red-600 px-7 py-3 hover:brightness-90 dark:bg-red-800"
        >
          Sair da reunião
        </Link>
      </div>

      {chat.isChatOpen && (
        <div className="flex w-[24rem] shrink-0 items-center justify-center border border-[#EDF0F6] dark:border-[#1F2335]">
          <ChatInput />
        </div>
      )}
    </footer>
  );
};
