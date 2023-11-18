import { Button } from "../common/Button";
import { SiderbarHeader } from "./SiderbarHeader";

import inviteUserIcon from "../../assets/userAdd.svg";

import { Participants } from "./Participants";

export const ParticipantsListSidebar: React.FC<{
  handleMinimizar: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ handleMinimizar }) => {
  return (
    <div
      className="group flex flex-col aria-expanded:min-h-[40%] aria-expanded:flex-1"
      aria-expanded="true"
    >
      <SiderbarHeader
        className="border-b border-[#EDF0F6] dark:border-[#1F2335]"
        name="Participantes"
        handleMinimizar={handleMinimizar}
      >
        <Button className="flex gap-2 bg-blue-50 px-5 py-[0.6rem] text-blue-800 hover:brightness-95 dark:bg-darkBlue-400 dark:text-blue-700 dark:hover:brightness-110">
          <span className="text-sm">Convidar</span>
          <img width={18} src={inviteUserIcon} />
        </Button>
      </SiderbarHeader>
      <Participants />
    </div>
  );
};
