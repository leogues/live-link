import { useContext } from "react";
import { useStore } from "zustand";
import { ChatStoreContext, ChatStoreState } from "../context/ChatStoreContext";
import { StateSelector } from "../types/store";

const useChatStore = <T>(selector: StateSelector<ChatStoreState, T>): T => {
  const store = useContext(ChatStoreContext);
  if (!store) {
    throw new Error("Missing ChatStoreProvider");
  }

  return useStore(store, selector);
};

export const useChatIsOpen = () => useChatStore((state) => state.isChatOpen);

export const useChatMessages = () => useChatStore((state) => state.messages);

export const useChatMenuRefs = () => useChatStore((state) => state.menuRef);

export const useChatActions = () => useChatStore((state) => state.actions);
