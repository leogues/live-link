import { useContext } from "react";

import micOffIcon from "../../assets/micOffControl.svg";
import micOnIcon from "../../assets/micOnControl.svg";

import videoOnIcon from "../../assets/videoOnControl.svg";
import videoOffIcon from "../../assets/videoOffControl.svg";

import screenSharingOnIcon from "../../assets/screensharingOn.svg";
import screenSharingOffIcon from "../../assets/screensharingOff.svg";

import chatOnIcon from "../../assets/chatOn.svg";
import chatOffIcon from "../../assets/chatOff.svg";

import { ToggleButton } from "../ToggleButton";
import { StreamContext } from "../../context/StreamContext";
import { ChatContext } from "../../context/ChatContext";
import { ChatState } from "../../reducers/chatReduces";

export const RoomControlButtons: React.FC<{ chat: ChatState }> = ({ chat }) => {
  const { mediaTracks, handleMicOn, handleScreenOn, handleWebCamOn } =
    useContext(StreamContext);

  const { toggleChat } = useContext(ChatContext);

  const isMicOn = mediaTracks.audioTrack?.enabled;
  const isWebCamOn = mediaTracks.videoTrack?.enabled;
  const isSharingScreenOn = mediaTracks.screenTrack?.enabled;

  return (
    <div className="flex items-center gap-4 px-4">
      <ToggleButton enabled={isMicOn} onClick={handleMicOn}>
        <img className="h-6 w-6" src={isMicOn ? micOnIcon : micOffIcon} />
      </ToggleButton>
      <ToggleButton enabled={isWebCamOn} onClick={handleWebCamOn}>
        <img
          className="h-6 w-6"
          src={isWebCamOn ? videoOnIcon : videoOffIcon}
        />
      </ToggleButton>
      <ToggleButton enabled={isSharingScreenOn} onClick={handleScreenOn}>
        <img
          className="h-6 w-6"
          src={isSharingScreenOn ? screenSharingOnIcon : screenSharingOffIcon}
        />
      </ToggleButton>
      <ToggleButton
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
