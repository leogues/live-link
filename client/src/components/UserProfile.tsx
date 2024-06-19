import clsx from "clsx";

import { IUser } from "../context/UserV2Context";
import baseUrl from "../services/apiUrl";
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
    <div className={clsx("lg:grow", className)}>
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
