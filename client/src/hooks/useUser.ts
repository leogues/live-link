import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { IUser } from "../types/peer";

const getMe = async () => {
  const response = await api.get<IUser>("/user");
  return response.data;
};

export const useMeQuery = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
