import { useContext } from "react";
import { StateSelector, useStore } from "zustand";
import { RoomStoreContext, RoomStoreState } from "../context/RoomStoreContext";

const useRoomStore = <T>(selector: StateSelector<RoomStoreState, T>): T => {
  const store = useContext(RoomStoreContext);
  if (!store) {
    throw new Error("Missing RoomStoreProvider");
  }

  return useStore(store, selector);
};

export const useIsEnteredRoom = (): boolean =>
  useRoomStore((state) => state.isEnteredRoom);

export const useRoomPeers = () => useRoomStore((state) => state.peers);

export const useRoomActions = () => useRoomStore((state) => state.actions);
