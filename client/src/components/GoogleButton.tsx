import GoogleIcon from "../assets/google.png";
import { Button } from "./common/Button";

export const GoogleButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-1 border border-gray-400 px-6 py-3 font-bold hover:bg-neutral-200 dark:border-darkBlue-600 dark:hover:bg-darkBlue-600 sm:gap-3"
    >
      <img src={GoogleIcon} />
      <span>Continue com o Google</span>
    </Button>
  );
};
