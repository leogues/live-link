import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StoreApi, createStore } from "zustand";
import { ws } from "../services/ws";

type ChatStoreContextType = StoreApi<ChatStoreState> | null;

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

export const ChatStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() =>
    createStore<ChatStoreState>((set) => ({
      messages: [],
      isChatOpen: false,
      menuRef: {
        chatInput: useRef<HTMLInputElement>(null),
        chat: useRef<HTMLDivElement>(null),
        inviteModal: useRef<HTMLDivElement>(null),
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
