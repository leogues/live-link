import { AxiosError } from "axios";
import { createContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  addAllPeersAction,
  addPeerAction,
  removePeerAction,
  updateMicrophoneStateAction,
  updateSharingScreenStateAction,
  updateWebCamStateAction,
} from "../reducers/peersActions";
import { PeerAction, peersReducer, PeerState } from "../reducers/peersReducer";
import api from "../services/api";
import { ws } from "../services/ws";
import { IPeer } from "../types/peer";

export type IRoom = {
  id: string;
  topic: string;
  userId?: string;
  createdAt: string;
};

export type RoomV2Value = {
  isEnteredRoom: boolean;
  // setIsEnteredRoom: React.Dispatch<React.SetStateAction<boolean>>;
  toggleEnteredRoom: React.DispatchWithoutAction;
  room?: IRoom;
  peers: PeerState;
  dispatchPeers: React.Dispatch<PeerAction>;
  isLoading: boolean;
};

type MediaDeviceAccepted = "microphone" | "web-cam" | "sharing-screen";

export type MediaDeviceUpdate = {
  peerId: string;
  enabled: boolean;
};

interface RoomV2ContextProps {
  children: React.ReactNode;
}

export const RoomV2Context = createContext<RoomV2Value>({
  isEnteredRoom: false,
  toggleEnteredRoom: () => {},
  room: {
    id: "",
    topic: "",
    createdAt: "",
    userId: "",
  },
  peers: {},
  dispatchPeers: (_value: PeerAction) => {},
  isLoading: false,
});

export const RoomV2Provider: React.FunctionComponent<RoomV2ContextProps> = ({
  children,
}) => {
  const { id } = useParams();
  const [peers, dispatchPeers] = useReducer(peersReducer, {});
  const [isEnteredRoom, toggleEnteredRoom] = useReducer(
    (previous) => !previous,
    false,
  );

  const { data: room, isLoading } = useQuery<IRoom, AxiosError>({
    queryKey: ["roomData"],
    queryFn: async () => {
      const response = await api.get(`/room/${id}`);
      return response.data;
    },
  });

  const getUsers = ({
    participants,
  }: {
    participants: Record<string, PeerState>;
  }) => {
    dispatchPeers(addAllPeersAction(participants));
  };

  const addPeer = (peer: IPeer) => {
    dispatchPeers(addPeerAction(peer));
  };

  const removePeer = (peerId: string) => {
    dispatchPeers(removePeerAction(peerId));
  };

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
      ({ peerId, enabled }: MediaDeviceUpdate) => void
    > = {
      microphone: ({ peerId, enabled }: MediaDeviceUpdate) => {
        dispatchPeers(updateMicrophoneStateAction({ peerId, enabled }));
      },
      "web-cam": ({ peerId, enabled }: MediaDeviceUpdate) => {
        dispatchPeers(updateWebCamStateAction({ peerId, enabled }));
      },
      "sharing-screen": ({ peerId, enabled }: MediaDeviceUpdate) => {
        dispatchPeers(updateSharingScreenStateAction({ peerId, enabled }));
      },
    };

    const mediaDeviceStateDispatch = mediaDeviceStatusUpdateAccepted[type];

    if (!mediaDeviceStateDispatch) {
      throw new Error(
        "Função de dispatch não encontrada para esse dispositivo de mídia",
      );
    }

    mediaDeviceStateDispatch({ peerId, enabled });
  };

  useEffect(() => {
    ws.on("get-users", getUsers);
    ws.on("user-joined", addPeer);
    ws.on("user-disconnected", removePeer);
    ws.on("mediaDeviceStatusNotification", mediaDeviceStatusUpdate);

    return () => {
      ws.off("get-users");
      ws.off("user-joined");
      ws.off("user-disconnected");
    };
  }, []);

  return (
    <RoomV2Context.Provider
      value={{
        isEnteredRoom,
        toggleEnteredRoom,
        room,
        peers,
        dispatchPeers,
        isLoading,
      }}
    >
      {children}
    </RoomV2Context.Provider>
  );
};
