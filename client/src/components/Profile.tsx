import clsx from "clsx";

import { LeaveIcon } from "../icons/Leave";
import { cn } from "../utils/cn";
import { Button } from "./common/Button";

export interface ProfileProps {
  name: string;
  lastName: string;
  picture: string;
  role?: string;
  hiddenBreakpoint?: "lg" | "none";
  fontSize?: "sm" | "md";
  imageSize?: "sm" | "md";
  bgColor?: "default" | "transparent";
  marginRight?: "none" | "4";
  onClick?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  name,
  lastName,
  picture,
  role,
  hiddenBreakpoint = "none",
  fontSize = "md",
  imageSize = "md",
  bgColor = "default",
  marginRight = "none",
  onClick,
}) => {
  return (
    <div
      className={cn("flex items-center gap-4 rounded-full p-2 md:py-2", {
        "flex w-full px-3": hiddenBreakpoint === "none",
        "bg-gray-100 dark:bg-darkBlue-600": bgColor === "default",
      })}
    >
      <div
        className={clsx("min-w-max overflow-hidden rounded-full", {
          "h-10 w-10": imageSize === "sm",
          "h-12 w-12": imageSize === "md",
        })}
      >
        <img className="block h-full" src={picture} />
      </div>
      <div
        className={cn({
          "hidden lg:block": hiddenBreakpoint === "lg",
        })}
      >
        <div className="flex flex-col">
          <div
            className={clsx(
              "flex gap-1 font-medium text-darkBlue-650 dark:text-blue-100",
              {
                "text-sm": fontSize === "sm",
                "text-base": fontSize === "md",
              },
            )}
          >
            <span>{name}</span>
            <span>{lastName}</span>
          </div>
          {role && <span className="text-xs text-gray-600">{role}</span>}
        </div>
      </div>
      <div className="ml-auto hidden h-full items-center lg:flex">
        <Button
          className={clsx(
            "min-h-max hover:brightness-200 dark:hover:brightness-75",
            {
              "mr-4": marginRight === "4",
            },
          )}
          onClick={onClick}
        >
          <LeaveIcon
            width={24}
            height={24}
            className="text-darkBlue-650 dark:text-blue-100"
          />
        </Button>
      </div>
    </div>
  );
};
