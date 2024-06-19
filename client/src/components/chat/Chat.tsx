import { useContext } from "react";

import { ChatContext } from "../../context/ChatContext";
import { ChatBubble } from "./ChatBubble";

export const Chat: React.FC = () => {
  const { chat } = useContext(ChatContext);

  return (
    <>
      <div className="hidden min-h-0 grow flex-col justify-between group-aria-[expanded=true]:flex">
        <div className="chat-container flex h-full max-h-full flex-col gap-2 overflow-y-auto px-4 py-4 ">
          {chat.messages?.map((message: IMessage, index: number) => (
            <ChatBubble
              message={message}
              prevMessage={chat.messages[index - 1]}
              key={message.timestamp + message.userId}
            />
          ))}
        </div>
      </div>
    </>
  );
};
