import { UserV2Context, UserV2Value } from "../../context/UserV2Context";

export type IUserProviderProps = UserV2Value;

export type UserCustomProviderProps = {
  children: any;
  providerProps?: IUserProviderProps | {};
};

export const userCustomProviderProps = ({
  children,
  providerProps = {},
}: UserCustomProviderProps) => {
  const defaultProps: IUserProviderProps = {
    user: {
      id: "testid",
      name: "nametestid",
      lastName: "",
      picture: "",
    },
    isLoading: true,
  };

  const props = { ...defaultProps, ...providerProps };

  return (
    <UserV2Context.Provider value={props}>{children}</UserV2Context.Provider>
  );
};
