import { useContext } from 'react';
import { useStore } from 'zustand';
import { RoomStoreContext, RoomStoreState } from '../context/RoomStoreContext';
import { StateSelector } from '../types/store';

const useRoomStore = <T>(selector: StateSelector<RoomStoreState, T>) => {
  const store = useContext(RoomStoreContext);
  if (!store) {
    throw new Error('Missing RoomStoreProvider');
  }

  return useStore(store, selector);
};

export const useIsEnteredRoom = () =>
  useRoomStore(state => state.isEnteredRoom);

export const useRoomPeers = () => useRoomStore(state => state.peers);

export const useRoomActions = () => useRoomStore(state => state.actions);
