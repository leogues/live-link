import { MediaDeviceUpdate } from "../context/RoomV2Context";
import { IPeer } from "../types/peer";
import { PeerState } from "./peersReducer";

export const ADD_PEER = "ADD_PEER" as const;
export const REMOVE_PEER = "REMOVE_PEER" as const;
export const ADD_PEER_STREAM = "ADD_PEER_STREAM" as const;
export const UPDATE_PEER_MICROPHONE_STATE =
  "UPDATE_PEER_MICROPHONE_STATE" as const;
export const UPDATE_PEER_WEBCAM_STATE = "UPDATE_PEER_WEBCAM_STATE" as const;
export const UPDATE_PEER_SHARINGSCREEN_STATE =
  "UPDATE_PEER_SHARINGSCREEN_STATE" as const;
export const REMOVE_PEER_STREAM = "REMOVE_PEER_STREAM" as const;
export const ADD_ALL_PEERS = "ADD_ALL_PEERS" as const;

export const addPeerAction = (peer: IPeer) => ({
  type: ADD_PEER,
  payload: { peer },
});

export const removePeerAction = (userId: string) => ({
  type: REMOVE_PEER,
  payload: { userId },
});

export const addPeerStreamAction = (userId: string, stream: MediaStream) => ({
  type: ADD_PEER_STREAM,
  payload: { userId, stream },
});

export const updateMicrophoneStateAction = ({
  peerId,
  enabled,
}: MediaDeviceUpdate) => ({
  type: UPDATE_PEER_MICROPHONE_STATE,
  payload: { peerId, enabled },
});

export const updateWebCamStateAction = ({
  peerId,
  enabled,
}: MediaDeviceUpdate) => ({
  type: UPDATE_PEER_WEBCAM_STATE,
  payload: { peerId, enabled },
});

export const updateSharingScreenStateAction = ({
  peerId,
  enabled,
}: MediaDeviceUpdate) => ({
  type: UPDATE_PEER_SHARINGSCREEN_STATE,
  payload: { peerId, enabled },
});

export const removePeerStreamAction = (userId: string) => ({
  type: REMOVE_PEER_STREAM,
  payload: { userId },
});

export const addAllPeersAction = (peers: Record<string, PeerState>) => ({
  type: ADD_ALL_PEERS,
  payload: { peers },
});
