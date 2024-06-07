import { useContext } from "react";

import chatOffIcon from "../../assets/chatOff.png";
import chatOnIcon from "../../assets/chatOn.png";
import micOffIcon from "../../assets/micOffControl.png";
import micOnIcon from "../../assets/micOnControl.png";
import screenSharingOffIcon from "../../assets/screensharingOff.png";
import screenSharingOnIcon from "../../assets/screensharingOn.png";
import videoOffIcon from "../../assets/videoOffControl.png";
import videoOnIcon from "../../assets/videoOnControl.png";
import { ChatContext } from "../../context/ChatContext";
import { StreamContext } from "../../context/StreamContext";
import { ChatState } from "../../reducers/chatReduces";
import { ToggleButton } from "../ToggleButton";

export const RoomControlButtons: React.FC<{ chat: ChatState }> = ({ chat }) => {
  const { mediaTracks, handleMicOn, handleScreenOn, handleWebCamOn } =
    useContext(StreamContext);

  const { toggleChat } = useContext(ChatContext);

  const isMicOn = mediaTracks.audioTrack?.enabled;
  const isWebCamOn = mediaTracks.videoTrack?.enabled;
  const isSharingScreenOn = mediaTracks.screenTrack?.enabled;

  return (
    <div className="flex items-center gap-4 px-4">
      <ToggleButton testid="mic-toggle" enabled={isMicOn} onClick={handleMicOn}>
        <img className="h-6 w-6" src={isMicOn ? micOnIcon : micOffIcon} />
      </ToggleButton>
      <ToggleButton
        testid="web-cam-toggle"
        enabled={isWebCamOn}
        onClick={handleWebCamOn}
      >
        <img
          className="h-6 w-6"
          src={isWebCamOn ? videoOnIcon : videoOffIcon}
        />
      </ToggleButton>
      <ToggleButton
        testid="sharingscreen-toggle"
        enabled={isSharingScreenOn}
        onClick={handleScreenOn}
      >
        <img
          className="h-6 w-6"
          src={isSharingScreenOn ? screenSharingOnIcon : screenSharingOffIcon}
        />
      </ToggleButton>
      <ToggleButton
        testid="chat-toggle"
        enabled={chat.isChatOpen}
        onClick={() => {
          toggleChat();
        }}
      >
        <img
          className="h-6 w-6"
          src={chat.isChatOpen ? chatOnIcon : chatOffIcon}
        />
      </ToggleButton>
    </div>
  );
};
