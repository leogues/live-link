import clsx from "clsx";

import { IUser } from "../context/UserV2Context";
import { Profile } from "./Profile";

type UserProfileProps = {
  user?: IUser;
  className?: string;
  role?: string;
  bgColor?: "transparent";
  fontSize?: "sm" | "md";
  imageSize?: "sm" | "md";
  marginRight?: "none" | "4";
};

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  role,
  bgColor,
  fontSize,
  imageSize,
  marginRight,
  className,
}) => {
  return (
    <div className={clsx("lg:grow", className)}>
      {user && (
        <Profile
          name={user.name}
          lastName={user.lastName}
          picture={user.picture}
          role={role}
          bgColor={bgColor}
          fontSize={fontSize}
          imageSize={imageSize}
          marginRight={marginRight}
        />
      )}
    </div>
  );
};
