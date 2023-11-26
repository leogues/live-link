import { Button } from "./common/Button";
import ChatIcon from "../assets/chat.png";

export const ChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button className="p-4 text-white" onClick={onClick}>
      <img src={ChatIcon} />
    </Button>
  );
};
