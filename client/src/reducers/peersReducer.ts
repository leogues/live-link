import { IUser } from "../context/UserV2Context";
import { IPeer } from "../types/peer";
import {
  ADD_ALL_PEERS,
  ADD_PEER,
  ADD_PEER_STREAM,
  REMOVE_PEER,
  REMOVE_PEER_STREAM,
  UPDATE_PEER_MICROPHONE_STATE,
  UPDATE_PEER_SHARINGSCREEN_STATE,
  UPDATE_PEER_WEBCAM_STATE,
} from "./peersActions";

export type IPeerState = {
  user?: IUser;
  stream?: MediaStream;
  isMicOn?: boolean;
  isWebCamOn?: boolean;
  isSharingScreenOn?: boolean;
};

export type PeerState = Record<string, IPeerState>;

export type PeerAction =
  | {
      type: typeof ADD_PEER;
      payload: { peer: IPeer };
    }
  | {
      type: typeof REMOVE_PEER;
      payload: { userId: string };
    }
  | {
      type: typeof ADD_PEER_STREAM;
      payload: { userId: string; stream: MediaStream };
    }
  | {
      type: typeof UPDATE_PEER_MICROPHONE_STATE;
      payload: { peerId: string; enabled: boolean };
    }
  | {
      type: typeof UPDATE_PEER_SHARINGSCREEN_STATE;
      payload: { peerId: string; enabled: boolean };
    }
  | {
      type: typeof UPDATE_PEER_WEBCAM_STATE;
      payload: { peerId: string; enabled: boolean };
    }
  | {
      type: typeof REMOVE_PEER_STREAM;
      payload: { userId: string };
    }
  | {
      type: typeof ADD_ALL_PEERS;
      payload: {
        peers: Record<string, PeerState>;
      };
    };

export const peersReducer = (state: PeerState, action: PeerAction) => {
  switch (action.type) {
    case ADD_PEER:
      return {
        ...state,
        [action.payload.peer.user.id]: action.payload.peer as {
          user?: IUser;
          stream?: MediaStream;
          isMuted?: boolean;
          isSharingScreen?: boolean;
        },
      };

    case REMOVE_PEER:
      const { [action.payload.userId]: deleted, ...rest } = state;
      return rest;

    case ADD_PEER_STREAM:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          stream: action.payload.stream,
        },
      };
    case UPDATE_PEER_MICROPHONE_STATE:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          isMicOn: action.payload.enabled,
        },
      };
    case UPDATE_PEER_WEBCAM_STATE:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          isWebCamOn: action.payload.enabled,
        },
      };
    case UPDATE_PEER_SHARINGSCREEN_STATE:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          isSharingScreenOn: action.payload.enabled,
        },
      };

    case REMOVE_PEER_STREAM:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          stream: undefined,
        },
      };
    case ADD_ALL_PEERS:
      return { ...state, ...action.payload.peers };

    default:
      return { ...state };
  }
};
