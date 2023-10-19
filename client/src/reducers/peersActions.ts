import { IUser } from "../context/UserV2Context";
import { PeerState } from "./peersReducer";

export const ADD_PEER = "ADD_PEER" as const;
export const REMOVE_PEER = "REMOVE_PEER" as const;
export const ADD_PEER_STREAM = "ADD_PEER_STREAM" as const;
export const REMOVE_PEER_STREAM = "REMOVE_PEER_STREAM" as const;
export const ADD_ALL_PEERS = "ADD_ALL_PEERS" as const;

export const addPeerAction = (user: IUser) => ({
  type: ADD_PEER,
  payload: { user },
});

export const removePeerAction = (userId: string) => ({
  type: REMOVE_PEER,
  payload: { userId },
});

export const addPeerStreamAction = (userId: string, stream: MediaStream) => ({
  type: ADD_PEER_STREAM,
  payload: { userId, stream },
});

export const removePeerStreamAction = (userId: string) => ({
  type: REMOVE_PEER_STREAM,
  payload: { userId },
});

export const addAllPeersAction = (users: Record<string, PeerState>) => ({
  type: ADD_ALL_PEERS,
  payload: { users },
});
