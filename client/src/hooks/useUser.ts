import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { IUser } from "../types/peer";

const getMe = () => api.get<IUser>("/user").then((res) => res.data);

export const useMeQuery = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
