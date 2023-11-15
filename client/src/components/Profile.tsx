import { Button } from "./common/Button";
import VectorIcon from "../assets/Vector.svg";
import clsx from "clsx";

export interface ProfileProps {
  name: string;
  lastName: string;
  picture: string;
  role?: string;
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
  fontSize = "md",
  imageSize = "md",
  bgColor = "default",
  marginRight = "none",
  onClick,
}) => {
  return (
    <div
      className={clsx(
        "inline-block items-center justify-evenly gap-4 rounded-full p-2 md:py-2 lg:flex lg:w-full lg:px-3 ",
        {
          "bg-gray-100 dark:bg-darkBlue-600": bgColor === "default",
          "": bgColor === "transparent",
        },
      )}
    >
      <div
        className={clsx("min-w-max overflow-hidden rounded-full", {
          "h-10 w-10": imageSize === "sm",
          "h-12 w-12": imageSize === "md",
        })}
      >
        <img className="block h-full" src={picture} />
      </div>
      <div className="hidden lg:block">
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
          className={clsx("min-h-max", {
            "mr-4": marginRight === "4",
          })}
          onClick={onClick}
        >
          <img className="block " src={VectorIcon}></img>
        </Button>
      </div>
    </div>
  );
};
