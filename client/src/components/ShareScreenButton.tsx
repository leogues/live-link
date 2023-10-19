import { Button } from "./common/Button";
import ScreenIcon from "../assets/screen.svg";

export const ShareScreenButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <Button className="p-4" onClick={onClick}>
      <img src={ScreenIcon} />
    </Button>
  );
};