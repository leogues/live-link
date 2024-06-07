import { AxiosError } from "axios";
import { createContext } from "react";

import { useQuery } from "@tanstack/react-query";

import api from "../services/api";

export interface IUser {
  id: string;
  name: string;
  lastName: string;
  picture: string;
}

export type UserV2Value = {
  user?: IUser;
  isLoading: boolean;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserV2Context = createContext<UserV2Value>({
  user: {
    id: "",
    name: "",
    lastName: "",
    picture: "",
  },
  isLoading: false,
});

export const UserV2Provider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: user, isLoading } = useQuery<IUser, AxiosError>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await api.get("/user");
      return response.data;
    },
  });

  return (
    <UserV2Context.Provider value={{ user, isLoading }}>
      {children}
    </UserV2Context.Provider>
  );
};
