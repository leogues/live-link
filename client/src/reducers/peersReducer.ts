import { IUser } from "../context/UserV2Context";
import {
  ADD_PEER,
  REMOVE_PEER,
  ADD_PEER_STREAM,
  REMOVE_PEER_STREAM,
  ADD_ALL_PEERS,
} from "./peersActions";

export type PeerState = Record<string, { user?: IUser; stream?: MediaStream }>;

export type PeerAction =
  | {
      type: typeof ADD_PEER;
      payload: { user: IUser };
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
      type: typeof REMOVE_PEER_STREAM;
      payload: { userId: string };
    }
  | {
      type: typeof ADD_ALL_PEERS;
      payload: {
        users: Record<string, PeerState>;
      };
    };

export const peersReducer = (state: PeerState, action: PeerAction) => {
  switch (action.type) {
    case ADD_PEER:
      return {
        ...state,
        [action.payload.user.id]: {
          user: action.payload.user,
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

    case REMOVE_PEER_STREAM:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          stream: undefined,
        },
      };
    case ADD_ALL_PEERS:
      return { ...state, ...action.payload.users };

    default:
      return { ...state };
  }
};
