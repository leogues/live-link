import { createContext } from "react";
import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../services/api";
import { ws } from "../services/ws";
import { IUser } from "./UserV2Context";

interface StreamValue {}

interface StreamContextProps {
  children: React.ReactNode;
}

// export const RoomContext = createContext<RoomV2Value>({
//   peers: {},
//   shareScreen: () => {},
//   setRoomId: (_id) => {},
//   screenSharingId: "",
//   roomId: "",
// });

export const StreamContext = createContext<StreamValue>({});

export const StreamProvider: React.FunctionComponent<StreamContextProps> = ({
  children,
}) => {
  return <StreamContext.Provider value={{}}>{children}</StreamContext.Provider>;
};
