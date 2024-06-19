import { createContext, ReactNode, useEffect, useReducer, useRef } from "react";

import {
  addHistoryAction,
  addMessageAction,
  toggleChatAction,
} from "../reducers/chatActions";
import { chatReducer, ChatState } from "../reducers/chatReduces";
import { ws } from "../services/ws";

interface SendMessageProps {
  content: string;
  userId: string;
  name: string;
  lastName?: string;
  picture: string;
  roomId: string;
}
export type ChatValue = {
  chat: ChatState;
  menuRef: {
    chatInput: React.RefObject<HTMLDivElement>;
    chat: React.RefObject<HTMLDivElement>;
    inviteModal: React.RefObject<HTMLDivElement>;
  };

  sendMessage: ({
    roomId,
    content,
    userId,
    name,
    lastName,
    picture,
  }: SendMessageProps) => void;
  toggleChat: () => void;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatContext = createContext<ChatValue>({
  chat: {
    messages: [],
    isChatOpen: false,
  },
  menuRef: {
    chatInput: { current: null },
    chat: { current: null },
    inviteModal: { current: null },
  },
  sendMessage: ({}) => {},
  toggleChat: () => {},
});

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
  });
  const menuRef = {
    chatInput: useRef<HTMLInputElement>(null),
    chat: useRef<HTMLDivElement>(null),
    inviteModal: useRef<HTMLDivElement>(null),
  };

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
        menuRef,
        sendMessage,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
