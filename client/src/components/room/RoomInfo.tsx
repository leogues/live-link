import { Link } from "react-router-dom";

import { IRoom } from "../../context/RoomV2Context";
import { LogoIcon } from "../../icons/Logo";
import { formatDate } from "../../utils/dateUtils";

export const RoomInfo: React.FC<{ room?: IRoom }> = ({ room }) => {
  if (!room) return null;

  const createAtFormated = formatDate(room.createdAt);

  return (
    <>
      <div className="min-w-max border-r border-opacity-60 px-6 py-3 dark:border-[#23212194] md:p-4 md:px-8">
        <Link to="/">
          <LogoIcon className="block h-12 w-12 text-blue-700 hover:brightness-110 md:h-16 md:w-16" />
        </Link>
      </div>
      <div className="ml-10 hidden flex-col sm:flex">
        <span className="truncate text-2xl text-gray-850 dark:text-[#E2E2E2]">
          {room.topic}
        </span>
        <span className="truncate text-gray-400 dark:text-[#9F9F9F]">
          {createAtFormated}
        </span>
      </div>
    </>
  );
};
