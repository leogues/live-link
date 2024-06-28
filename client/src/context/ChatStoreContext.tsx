import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { StoreApi, createStore } from "zustand";
import { ws } from "../services/ws";

export type ChatStoreContextType = StoreApi<ChatStoreState> | null;

export const ChatStoreContext = createContext<ChatStoreContextType>(null);

export type ChatStoreState = {
  messages: IMessage[];
  isChatOpen: boolean;
  menuRef: {
    chatInput: React.RefObject<HTMLInputElement>;
    chat: React.RefObject<HTMLDivElement>;
    inviteModal: React.RefObject<HTMLDivElement>;
  };
  actions: {
    addMessage: (message: IMessage) => void;
    addHistory: (history: IMessage[]) => void;
    toggleChat: () => void;
  };
};

type ChatStoreProps = {
  initialIsChatOpen: boolean;
};

export const ChatStoreProvider: FC<PropsWithChildren<ChatStoreProps>> = ({
  children,
  initialIsChatOpen,
}) => {
  const [store] = useState(() =>
    createStore<ChatStoreState>((set) => ({
      messages: [],
      isChatOpen: initialIsChatOpen,
      menuRef: {
        chatInput: {
          current: null,
        },
        chat: { current: null },
        inviteModal: { current: null },
      },
      actions: {
        toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
        addHistory: (history) => set({ messages: history }),
        addMessage: (message) =>
          set((state) => ({ messages: [...state.messages, message] })),
      },
    })),
  );

  const { actions } = store.getState();

  useEffect(() => {
    ws.on("add-message", actions.addMessage);
    ws.on("get-messages", actions.addHistory);
    return () => {
      ws.off("add-message");
      ws.off("get-messages");
    };
  }, []);

  return (
    <ChatStoreContext.Provider value={store}>
      {children}
    </ChatStoreContext.Provider>
  );
};
