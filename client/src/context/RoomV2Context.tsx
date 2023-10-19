import { createContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../services/api";
import { ws } from "../services/ws";
import { PeerState, peersReducer } from "../reducers/peersReducer";
import { addAllPeersAction } from "../reducers/peersActions";

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

export const RoomV2Context = createContext<RoomV2Value>({
  room: {
    id: "",
    topic: "",
    createdAt: "",
    userId: "",
  },
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

  useEffect(() => {
    ws.on("get-users", getUsers);

    return () => {
      ws.off("get-users");
    };
  }, []);

  console.log(peers);

  return (
    <RoomV2Context.Provider value={{ room, isLoading }}>
      {children}
    </RoomV2Context.Provider>
  );
};
