import { useContext } from "react";

import { UserV2Context } from "../../context/UserV2Context";
import { useThisRoom } from "../../hooks/useRoom";
import { useRoomPeers } from "../../hooks/useRoomStore";
import { Switcher } from "../Switcher";
import { UserProfile } from "../UserProfile";
import { ParticipantAvatars } from "./ParticipantsAvatars";
import { RoomInfo } from "./RoomInfo";

export const RoomHeader: React.FC = () => {
  const { data: room } = useThisRoom();
  const peers = useRoomPeers();
  const { user } = useContext(UserV2Context);

  return (
    <header className=" flex items-center border border-[rgba(217,217,217,0.29)] bg-white dark:border-[#3333] dark:border-opacity-30 dark:bg-darkBlue-900">
      <RoomInfo room={room} />
      <div className="ml-auto flex items-center px-3 lg:basis-[32rem] lg:px-7">
        <ParticipantAvatars peers={peers} />

        <UserProfile
          className="ml-7"
          user={user}
          role={user?.id === room?.userId ? "Moderador" : "Participante"}
          hiddenBreakpoint="lg"
          fontSize="sm"
          imageSize="sm"
          marginRight="4"
        />
        <div className="ml-7">
          <Switcher />
        </div>
      </div>
    </header>
  );
};
