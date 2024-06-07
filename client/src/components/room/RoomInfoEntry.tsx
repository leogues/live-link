import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { RoomV2Context } from "../../context/RoomV2Context";
import { formatDate } from "../../utils/DateUtils";
import { MeetingButtons } from "../home/MeetingButtons";

export const RoomInfoEntry: React.FC = () => {
  const { room, setIsEnteredRoom } = useContext(RoomV2Context);
  const navigate = useNavigate();

  const redirectHomeHandle = () => {
    navigate("../");
  };

  const enterRoomHandle = () => {
    setIsEnteredRoom(true);
  };

  const createAtFormated = !!room ? formatDate(room.createdAt) : null;

  return (
    <div className="font-family flex h-full flex-grow items-center justify-center text-gray-850 dark:text-gray-300">
      <div className="w-full max-w-md rounded-md bg-white px-10 py-8 shadow-md dark:bg-darkBlue-900">
        <div className="flex flex-col">
          <span className="text-center text-2xl text-gray-850 dark:text-[#E2E2E2]">
            {room?.topic}
          </span>
          <span className="mt-4 text-center text-gray-400 dark:text-[#9F9F9F]">
            {createAtFormated}
          </span>

          <MeetingButtons
            leftButtonText="Voltar para home"
            leftButtonHandle={redirectHomeHandle}
            rightButtonText="Entrar"
            rightButtonHandle={enterRoomHandle}
          />
        </div>
      </div>
    </div>
  );
};
