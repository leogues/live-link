import { IUser } from "../context/UserV2Context";
import { Profile } from "./Profile";

export const UserProfile: React.FC<{ user?: IUser }> = ({ user }) => {
  return (
    <div className="mt-8 flex w-full items-center gap-4 px-1">
      {user && (
        <Profile
          name={user.name}
          lastName={user.lastName}
          picture={user.picture}
          bgColor="transparent"
        />
      )}
    </div>
  );
};
