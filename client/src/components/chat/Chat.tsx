import { useEffect } from 'react';
import { useChatMessages } from '../../hooks/useChatStore';
import { ChatBubble } from './ChatBubble';

export const Chat: React.FC = () => {
  const messages = useChatMessages();

  function scrollToBottom() {
    const chatContainer = document.querySelector('.chat-container');

    if (!chatContainer) return;

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="hidden min-h-0 grow flex-col justify-between group-aria-[expanded=true]:flex">
        <div className="chat-container flex h-full max-h-full flex-col gap-2 overflow-y-auto px-4 py-4 ">
          {messages?.map((message: IMessage, index: number) => (
            <ChatBubble
              message={message}
              prevMessage={messages[index - 1]}
              key={message.timestamp + message.userId}
            />
          ))}
        </div>
      </div>
    </>
  );
};
