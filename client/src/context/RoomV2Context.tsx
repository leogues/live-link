import { createContext } from "react";
import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../services/api";

interface Room {
  id: string;
  topic: string;
  userId?: string;
  createdAt: string;
}

interface RoomV2Value {
  room?: Room;
  isLoading: boolean;
}

interface RoomV2ContextProps {
  children: React.ReactNode;
}

// export const RoomContext = createContext<RoomV2Value>({
//   peers: {},
//   shareScreen: () => {},
//   setRoomId: (_id) => {},
//   screenSharingId: "",
//   roomId: "",
// });

export const RoomV2Context = createContext<RoomV2Value>({
  room: {
    id: "",
    topic: "",
    userId: "",
    createdAt: "",
  },
  isLoading: false,
});

export const RoomV2Provider: React.FunctionComponent<RoomV2ContextProps> = ({
  children,
}) => {
  const { id } = useParams();

  const { data: room, isLoading } = useQuery<Room, AxiosError>({
    queryKey: ["roomData"],
    queryFn: async () => {
      const response = await api.get(`/room/${id}`);
      return response.data;
    },
  });

  return (
    <RoomV2Context.Provider value={{ room, isLoading }}>
      {children}
    </RoomV2Context.Provider>
  );
};
