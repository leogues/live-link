import { createContext, useEffect, useReducer } from "react";
import { chatReducer, ChatState } from "../reducers/chatReduces";
import {
  addHistoryAction,
  addMessageAction,
  toggleChatAction,
} from "../reducers/chatActions";
import { ws } from "../services/ws";

interface SendMessageProps {
  content: string;
  userId: string;
  name: string;
  lastName?: string;
  picture: string;
  roomId: string;
}
interface ChatValue {
  chat: ChatState;
  sendMessage: ({
    roomId,
    content,
    userId,
    name,
    lastName,
    picture,
  }: SendMessageProps) => void;
  toggleChat: () => void;
}

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatContext = createContext<ChatValue>({
  chat: {
    messages: [],
    isChatOpen: false,
  },
  sendMessage: ({}) => {},
  toggleChat: () => {},
});

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: true,
  });

  function scrollToBottom() {
    const chatContainer = document.querySelector(".chat-container");

    if (!chatContainer) return;

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  const sendMessage = ({
    roomId,
    content,
    userId,
    name,
    lastName,
    picture,
  }: SendMessageProps) => {
    const messageData: IMessage = {
      content,
      userId,
      name,
      lastName,
      picture,
      timestamp: new Date().getTime(),
    };

    chatDispatch(addMessageAction(messageData));

    ws.emit("send-message", roomId, messageData);
  };

  const addMessage = (message: IMessage) => {
    chatDispatch(addMessageAction(message));
  };

  const addHistory = (messages: IMessage[]) => {
    chatDispatch(addHistoryAction(messages));
  };

  const toggleChat = () => {
    chatDispatch(toggleChatAction(!chat.isChatOpen));
  };

  useEffect(() => {
    ws.on("add-message", addMessage);
    ws.on("get-messages", addHistory);
    return () => {
      ws.off("add-message", addMessage);
      ws.off("get-messages", addHistory);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);
  return (
    <ChatContext.Provider
      value={{
        chat,
        sendMessage,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
