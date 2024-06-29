import { useChatIsOpen, useChatMenuRefs } from "../../hooks/useChatStore";
import { ChatSidebar } from "./ChatSidebar";
import { ParticipantsListSidebar } from "./ParticipantsListSidebar";

export const RoomSiderbar: React.FC = () => {
  const isChatOpen = useChatIsOpen();
  const { chat } = useChatMenuRefs();

  const handleMinimizar = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;

    const divMinimize = button.closest("[aria-expanded]");

    if (!divMinimize) return;

    const ariaExpanded = divMinimize.getAttribute("aria-expanded");

    const isExpanded = ariaExpanded === "true";

    divMinimize.setAttribute("aria-expanded", String(!isExpanded));
  };

  return (
    <>
      {isChatOpen && (
        <div
          ref={chat}
          className="absolute right-0 z-50 flex h-full w-[20rem] shrink-0 flex-col border-l border-[#EDF0F6] bg-gray-100 shadow-md dark:border-[#1F2335] dark:bg-darkBlue-600 sm:w-[24rem] md:static"
        >
          <ParticipantsListSidebar handleMinimizar={handleMinimizar} />
          <ChatSidebar handleMinimizar={handleMinimizar} />
        </div>
      )}
    </>
  );
};
