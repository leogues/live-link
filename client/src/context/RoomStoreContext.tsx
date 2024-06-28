import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { StoreApi, createStore } from "zustand";
import { ws } from "../services/ws";
import { Peer, PeerMap, PeersResponse } from "../types/peer";

type MediaDeviceAccepted = "microphone" | "web-cam" | "sharing-screen";

export type RoomStoreContextType = StoreApi<RoomStoreState> | null;

export const RoomStoreContext = createContext<RoomStoreContextType>(null);

export type RoomStoreState = {
  isEnteredRoom: boolean;
  peers: PeerMap;
  actions: {
    toggleEnteredRoom: () => void;
    addPeer: (peer: Peer) => void;
    removePeer: (userId: string) => void;
    addPeerStream: (userId: string, stream: MediaStream) => void;
    removePeerStream: (userId: string) => void;
    addAllPeers: (peers: PeersResponse) => void;
    updateIsMicOn: (peerId: string, enabled: boolean) => void;
    updateIsWebCamOn: (peerId: string, enabled: boolean) => void;
    updateIsSharingScreenOn: (peerId: string, enabled: boolean) => void;
  };
};

export const RoomStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() =>
    createStore<RoomStoreState>((set) => ({
      isEnteredRoom: false,
      peers: {},
      actions: {
        toggleEnteredRoom: () =>
          set((state) => ({ isEnteredRoom: !state.isEnteredRoom })),
        addPeer: (peer) =>
          set((state) => ({
            peers: {
              ...state.peers,
              [peer.user.id]: peer,
            },
          })),
        removePeer: (userId) =>
          set((state) => {
            const { [userId]: _, ...rest } = state.peers;
            return { peers: rest };
          }),
        addPeerStream: (userId, stream) =>
          set((state) => ({
            peers: {
              ...state.peers,
              [userId]: {
                ...state.peers[userId],
                stream,
              },
            },
          })),
        removePeerStream: (userId) =>
          set((state) => ({
            peers: {
              ...state.peers,
              [userId]: {
                ...state.peers[userId],
                stream: undefined,
              },
            },
          })),
        addAllPeers: (peersResponse) =>
          set({ peers: peersResponse.participants }),
        updateIsMicOn: (peerId, enabled) =>
          set((state) => ({
            peers: {
              ...state.peers,
              [peerId]: {
                ...state.peers[peerId],
                isMicOn: enabled,
              },
            },
          })),
        updateIsWebCamOn: (peerId, enabled) =>
          set((state) => ({
            peers: {
              ...state.peers,
              [peerId]: {
                ...state.peers[peerId],
                isWebCamOn: enabled,
              },
            },
          })),
        updateIsSharingScreenOn: (peerId, enabled) =>
          set((state) => ({
            peers: {
              ...state.peers,
              [peerId]: {
                ...state.peers[peerId],
                isSharingScreenOn: enabled,
              },
            },
          })),
      },
    })),
  );

  const {
    addPeer,
    removePeer,
    addAllPeers,
    updateIsMicOn,
    updateIsWebCamOn,
    updateIsSharingScreenOn,
  } = store.getState().actions;

  const mediaDeviceStatusUpdate = ({
    peerId,
    type,
    enabled,
  }: {
    peerId: string;
    type: MediaDeviceAccepted;
    enabled: boolean;
  }) => {
    const mediaDeviceStatusUpdateAccepted: Record<
      MediaDeviceAccepted,
      (peerId: string, enabled: boolean) => void
    > = {
      microphone: updateIsMicOn,
      "web-cam": updateIsWebCamOn,
      "sharing-screen": updateIsSharingScreenOn,
    };

    const mediaDeviceStateDispatch = mediaDeviceStatusUpdateAccepted[type];

    if (!mediaDeviceStateDispatch) {
      throw new Error(
        "Função de dispatch não encontrada para esse dispositivo de mídia",
      );
    }

    mediaDeviceStateDispatch(peerId, enabled);
  };

  useEffect(() => {
    ws.on("get-users", addAllPeers);
    ws.on("user-joined", addPeer);
    ws.on("user-disconnected", removePeer);
    ws.on("mediaDeviceStatusNotification", mediaDeviceStatusUpdate);

    return () => {
      ws.off("get-users");
      ws.off("user-joined");
      ws.off("user-disconnected");
      ws.off("mediaDeviceStatusNotification");
    };
  }, []);

  return (
    <RoomStoreContext.Provider value={store}>
      {children}
    </RoomStoreContext.Provider>
  );
};
