export interface IUser {
  id: string;
  name: string;
  lastname?: string | null;
  picture?: string | null;
}

export interface IPeer {
  user: IUser;
  stream?: MediaStream;
  isMuted: boolean;
  isSharingScreen: boolean;
}
