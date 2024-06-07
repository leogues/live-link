import { useContext } from "react";

import { RoomV2Context } from "../../context/RoomV2Context";
import { UserV2Context } from "../../context/UserV2Context";
import { Switcher } from "../Switcher";
import { UserProfile } from "../UserProfile";
import { ParticipantAvatars } from "./ParticipantsAvatars";
import { RoomInfo } from "./RoomInfo";

export const RoomHeader: React.FC = () => {
  const { room, peers } = useContext(RoomV2Context);
  const { user } = useContext(UserV2Context);

  return (
    <header className="flex items-center border border-[rgba(217,217,217,0.29)] bg-white dark:border-[#3333] dark:border-opacity-30 dark:bg-darkBlue-900">
      <RoomInfo room={room} />
      <div className="ml-auto flex items-center px-7 lg:basis-[32rem]">
        <ParticipantAvatars peers={peers} />

        <UserProfile
          className="ml-7"
          user={user}
          role={user?.id === room?.userId ? "Moderador" : "Participante"}
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
