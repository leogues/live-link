import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { IRoom } from "../types/room";

const getRoom = async (roomId: string) => {
  const response = await api.get<IRoom>(`/room/${roomId}`);
  return response.data;
};

export const useRoomQuery = (roomId?: string) =>
  useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoom(roomId!),
    enabled: !!roomId,
  });

export const useThisRoom = () => {
  const { id } = useParams();
  return useRoomQuery(id);
};
