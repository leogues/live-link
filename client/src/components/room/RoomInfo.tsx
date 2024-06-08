import videoCamIcon from "../../assets/videoCam.png";
import { IRoom } from "../../context/RoomV2Context";
import { formatDate } from "../../utils/dateUtils";

export const RoomInfo: React.FC<{ room?: IRoom }> = ({ room }) => {
  if (!room) return null;

  const createAtFormated = formatDate(room.createdAt);

  return (
    <>
      <div className="min-w-max border-r border-opacity-60 p-4 px-8 dark:border-[#23212194]">
        <img className="block h-16 w-16" src={videoCamIcon} />
      </div>
      <div className="ml-10 flex flex-col">
        <span className="text-2xl text-gray-850 dark:text-[#E2E2E2]">
          {room.topic}
        </span>
        <span className="text-gray-400 dark:text-[#9F9F9F]">
          {createAtFormated}
        </span>
      </div>
    </>
  );
};
