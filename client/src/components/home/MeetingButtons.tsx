import { Button } from "../common/Button";

type MeetingHeaderProps = {
  createRoomHandle: () => void;
  joinButtonHandle: () => Promise<void>;
};

export const MeetingButtons: React.FC<MeetingHeaderProps> = ({
  createRoomHandle,
  joinButtonHandle,
}) => {
  return (
    <div className="mt-10 flex items-center gap-2 text-sm font-semibold">
      <div className="flex flex-1 flex-col gap-2">
        <Button
          onClick={createRoomHandle}
          className="bg-blue-50 py-3 text-blue-800 dark:bg-darkBlue-400 dark:text-blue-700"
        >
          Crie sua reunião
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Button
          className="bg-blue-800 py-3 text-white "
          onClick={joinButtonHandle}
        >
          Entrar na reunião
        </Button>
      </div>
    </div>
  );
};
