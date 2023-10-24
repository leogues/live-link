import { createContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
Peer;

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../services/api";
import { ws } from "../services/ws";
import { PeerAction, PeerState, peersReducer } from "../reducers/peersReducer";
import {
  addAllPeersAction,
  addPeerAction,
  removePeerAction,
} from "../reducers/peersActions";
import { IPeer } from "../types/peer";
import Peer from "peerjs";

interface Room {
  id: string;
  topic: string;
  userId?: string;
  createdAt: string;
}

interface RoomV2Value {
  room?: Room;
  peers: PeerState;
  dispatchPeers: React.Dispatch<PeerAction>;
  isLoading: boolean;
}

interface RoomV2ContextProps {
  children: React.ReactNode;
}

export const RoomV2Context = createContext<RoomV2Value>({
  room: {
    id: "",
    topic: "",
    createdAt: "",
    userId: "",
  },
  peers: {},
  dispatchPeers: (value: PeerAction) => {},
  isLoading: false,
});

export const RoomV2Provider: React.FunctionComponent<RoomV2ContextProps> = ({
  children,
}) => {
  const { id } = useParams();
  const [peers, dispatchPeers] = useReducer(peersReducer, {});

  const { data: room, isLoading } = useQuery<Room, AxiosError>({
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
    console.log("add:", peer);
    dispatchPeers(addPeerAction(peer));
  };

  const removePeer = (userId: string) => {
    console.log("removed", userId);
    dispatchPeers(removePeerAction(userId));
  };

  useEffect(() => {
    ws.on("get-users", getUsers);
    ws.on("user-joined", addPeer);
    ws.on("user-disconnected", removePeer);

    return () => {
      ws.off("get-users");
      ws.off("user-joined");
      ws.off("user-disconnected");
    };
  }, []);

  console.log(peers);

  return (
    <RoomV2Context.Provider value={{ room, peers, dispatchPeers, isLoading }}>
      {children}
    </RoomV2Context.Provider>
  );
};
