import { Button } from "./common/Button";
import { ws } from "../services/ws";

export const JoinButton: React.FC = () => {
  const createRoom = () => {
    ws.emit("create-room");
  };

  return (
    <div className="flex flex-col gap-3">
      <Button fontWeight="bold" onClick={createRoom} className=" px-8 text-xl">
        Start new meeting
      </Button>
    </div>
  );
};
