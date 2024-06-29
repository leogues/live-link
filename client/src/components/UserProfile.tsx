import baseUrl from "../services/apiUrl";
import { IUser } from "../types/peer";
import { cn } from "../utils/cn";
import { Profile, ProfileProps } from "./Profile";

type UserProfileProps = Omit<ProfileProps, "name" | "lastName" | "picture"> & {
  user?: IUser;
  className?: string;
};

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  role,
  hiddenBreakpoint,
  bgColor,
  fontSize,
  imageSize,
  marginRight,
  className,
}) => {
  const handleLogout = () => {
    window.location.href = `${baseUrl}/auth/logout`;
  };

  return (
    <div className={cn("lg:grow", className)}>
      {user && (
        <Profile
          name={user.name}
          lastName={user.lastName}
          picture={user.picture}
          hiddenBreakpoint={hiddenBreakpoint}
          role={role}
          bgColor={bgColor}
          fontSize={fontSize}
          imageSize={imageSize}
          marginRight={marginRight}
          onClick={handleLogout}
        />
      )}
    </div>
  );
};
