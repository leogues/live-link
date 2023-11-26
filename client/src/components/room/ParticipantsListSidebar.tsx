import { SiderbarHeader } from "./SiderbarHeader";

import { Participants } from "./Participants";
import { InviteUserModal } from "./InviteUserModal";

export const ParticipantsListSidebar: React.FC<{
  handleMinimizar: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ handleMinimizar }) => {
  return (
    <div
      className="group flex flex-col aria-expanded:min-h-[40%] aria-expanded:flex-1"
      data-testid="participants"
      aria-expanded="true"
    >
      <SiderbarHeader
        className="border-b border-[#EDF0F6] dark:border-[#1F2335]"
        name="Participantes"
        handleMinimizar={handleMinimizar}
        buttonTestId="participant-expand-toggle"
      >
        <InviteUserModal />
      </SiderbarHeader>
      <Participants />
    </div>
  );
};
