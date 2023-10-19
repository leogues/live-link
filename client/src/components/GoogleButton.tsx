import { Button } from "./common/Button";
import GoogleIcon from "../assets/google.svg";

export const GoogleButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-3 border border-gray-400 px-6 py-3 font-bold hover:bg-neutral-200 dark:border-darkBlue-600 dark:hover:bg-darkBlue-600"
    >
      <img src={GoogleIcon} />
      <span>Continue com o Google</span>
    </Button>
  );
};
