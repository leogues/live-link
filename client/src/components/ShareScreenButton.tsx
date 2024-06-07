import ScreenIcon from "../assets/screen.png";
import { Button } from "./common/Button";

export const ShareScreenButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <Button className="p-4" onClick={onClick}>
      <img src={ScreenIcon} />
    </Button>
  );
};
