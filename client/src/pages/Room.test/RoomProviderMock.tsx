import { RoomV2Context, RoomV2Value } from "../../context/RoomV2Context";

export type IRoomProviderProps = RoomV2Value;

export type RoomCustomProviderProps = {
  children: any;
  providerProps?: IRoomProviderProps | {};
};

export const mockedPeers = {
  "1": {
    isMicOn: true,
    isSharingScreenOn: false,
    isWebCamOn: false,
    stream: {} as MediaStream,
    user: {
      id: "1",
      name: "",
      lastName: "",
      picture: "",
    },
  },
  "2": {
    isMicOn: true,
    isSharingScreenOn: false,
    isWebCamOn: false,
    stream: {} as MediaStream,
    user: {
      id: "2",
      name: "",
      lastName: "",
      picture: "",
    },
  },
  "3": {
    isMicOn: true,
    isSharingScreenOn: false,
    isWebCamOn: false,
    stream: {} as MediaStream,
    user: {
      id: "3",
      name: "",
      lastName: "",
      picture: "",
    },
  },
  "4": {
    isMicOn: true,
    isSharingScreenOn: false,
    isWebCamOn: false,
    stream: {} as MediaStream,
    user: {
      id: "4",
      name: "",
      lastName: "",
      picture: "",
    },
  },
  "5": {
    isMicOn: true,
    isSharingScreenOn: false,
    isWebCamOn: false,
    stream: {} as MediaStream,
    user: {
      id: "5",
      name: "",
      lastName: "",
      picture: "",
    },
  },
};

export const mockedRoom = {
  id: "1",
  createdAt: "2023-11-17",
  topic: "Mock Room",
  userId: "1",
};

export const roomCustomProviderProps = ({
  children,
  providerProps = {},
}: RoomCustomProviderProps) => {
  const defaultProps: IRoomProviderProps = {
    isEnteredRoom: true,
    setIsEnteredRoom: () => {},
    room: mockedRoom,
    peers: mockedPeers,
    dispatchPeers: () => {},
    isLoading: true,
  };

  const props = { ...defaultProps, ...providerProps };

  return (
    <RoomV2Context.Provider value={props}>{children}</RoomV2Context.Provider>
  );
};
