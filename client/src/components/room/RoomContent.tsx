import { useIsChatOpen } from "../../hooks/useChatStore";
import { RoomSiderbar } from "./RoomSiderbar";
import { StreamArea } from "./stream/StreamArea";

export const RoomContent: React.FC = () => {
  const isChatOpen = useIsChatOpen();
  return (
    <>
      {isChatOpen && (
        <div className="absolute inset-0 z-30 block h-screen w-full bg-black bg-opacity-0 dark:bg-opacity-20 md:hidden"></div>
      )}
      <div className="flex flex-col overflow-hidden">
        <div className="relative flex h-full">
          <StreamArea />
          <RoomSiderbar />
        </div>
      </div>
    </>
  );
};
