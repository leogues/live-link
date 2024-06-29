import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { IRoom } from "../types/room";

const getRoom = (roomId: string) =>
  api.get<IRoom>(`/room/${roomId}`).then((res) => res.data);

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
