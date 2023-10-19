import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createContext } from "react";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  lastName: string;
  picture: string;
}

interface UserV2Value {
  user?: User;
  isLoading: boolean;
}

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
  const { data: user, isLoading } = useQuery<User, AxiosError>({
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
