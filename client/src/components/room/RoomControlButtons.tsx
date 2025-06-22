import { FC, useContext } from 'react';

import { StreamContext } from '../../context/StreamV2Context';
import { useChatActions, useChatIsOpen } from '../../hooks/useChatStore';
import { ChatControlIcon } from '../../icons/stream/ChatControl';
import { MicrophoneControlIcon } from '../../icons/stream/MicrophoneControl';
import { SharingScreenControlIcon } from '../../icons/stream/SharingScreenControl';
import { VideoControlIcon } from '../../icons/stream/VideoControl';
import { cn } from '../../utils/cn';
import { ToggleButton } from '../ToggleButton';

export const RoomControlButtons: FC = () => {
  const { mediaTracks, handleMicOn, handleScreenOn, handleWebCamOn } =
    useContext(StreamContext);

  const { toggleChat } = useChatActions();
  const isChatOpen = useChatIsOpen();

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
            ' text-blue-800': !isMicOn,
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
            'text-blue-800': !isWebCamOn,
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
            'text-blue-800': !isSharingScreenOn,
          })}
        />
      </ToggleButton>
      <ToggleButton
        testid="chat-toggle"
        enabled={isChatOpen}
        onClick={handleToggleChat}
      >
        <ChatControlIcon
          width={24}
          height={24}
          className={cn({ 'text-blue-800': !isChatOpen })}
        />
      </ToggleButton>
    </div>
  );
};
