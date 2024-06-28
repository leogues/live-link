import { useContext } from "react";
import { StateSelector, useStore } from "zustand";
import { ChatStoreContext, ChatStoreState } from "../context/ChatStoreContext";

const useChatStore = <T>(selector: StateSelector<ChatStoreState, T>): T => {
  const store = useContext(ChatStoreContext);
  if (!store) {
    throw new Error("Missing BearStoreProvider");
  }

  return useStore(store, selector);
};

export const useIsChatOpen = (): boolean =>
  useChatStore((state) => state.isChatOpen);

export const useMessages = (): IMessage[] =>
  useChatStore((state) => state.messages);

export const useChatMenuRefs = () => useChatStore((state) => state.menuRef);

export const useChatActions = () => useChatStore((state) => state.actions);
