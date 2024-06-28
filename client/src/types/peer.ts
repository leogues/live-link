export interface IUser {
  id: string;
  name: string;
  lastName?: string;
  picture: string;
}

export interface IPeer {
  user: IUser;
  stream?: MediaStream;
  isMuted: boolean;
  isSharingScreen: boolean;
}

export type Peer = {
  user: IUser;
  stream?: MediaStream;
  isMicOn: boolean;
  isWebCamOn: boolean;
  isSharingScreenOn: boolean;
};

export type PeerMap = Record<string, Peer>;

export type PeersResponse = {
  participants: PeerMap;
  roomId: string;
};
