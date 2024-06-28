import { useContext } from "react";

import { ChatContext } from "../../context/ChatContext";
import { StreamContext } from "../../context/StreamV2Context";
import { ChatControlIcon } from "../../icons/stream/ChatControl";
import { MicrophoneControlIcon } from "../../icons/stream/MicrophoneControl";
import { SharingScreenControlIcon } from "../../icons/stream/SharingScreenControl";
import { VideoControlIcon } from "../../icons/stream/VideoControl";
import { ChatState } from "../../reducers/chatReduces";
import { cn } from "../../utils/cn";
import { ToggleButton } from "../ToggleButton";

export const RoomControlButtons: React.FC<{ chat: ChatState }> = ({ chat }) => {
  const { mediaTracks, handleMicOn, handleScreenOn, handleWebCamOn } =
    useContext(StreamContext);

  const { toggleChat } = useContext(ChatContext);

  const isMicOn = mediaTracks.audioTrack?.enabled;
  const isWebCamOn = mediaTracks.videoTrack?.enabled;
  const isSharingScreenOn = mediaTracks.screenTrack?.enabled;

  function handleToggleChat(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleChat();
  }

  return (
    <div className="flex items-center gap-3">
      <ToggleButton testid="mic-toggle" enabled={isMicOn} onClick={handleMicOn}>
        <MicrophoneControlIcon
          width={24}
          height={24}
          className={cn({
            " text-blue-800": !isMicOn,
          })}
        />
      </ToggleButton>
      <ToggleButton
        testid="web-cam-toggle"
        enabled={isWebCamOn}
        onClick={handleWebCamOn}
      >
        <VideoControlIcon
          width={24}
          height={24}
          className={cn({
            "text-blue-800": !isWebCamOn,
          })}
        />
      </ToggleButton>
      <ToggleButton
        testid="sharingscreen-toggle"
        enabled={isSharingScreenOn}
        onClick={handleScreenOn}
      >
        <SharingScreenControlIcon
          width={24}
          height={24}
          className={cn({
            "text-blue-800": !isSharingScreenOn,
          })}
        />
      </ToggleButton>
      <ToggleButton
        testid="chat-toggle"
        enabled={chat.isChatOpen}
        onClick={handleToggleChat}
      >
        <ChatControlIcon
          width={24}
          height={24}
          className={cn({ "text-blue-800": !chat.isChatOpen })}
        />
      </ToggleButton>
    </div>
  );
};
