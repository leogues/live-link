import { useContext, useEffect } from "react";

import { ws } from "../services/ws";
import { ChatContext } from "../context/ChatContext";
import { UserV2Context } from "../context/UserV2Context";
import { RoomV2Context } from "../context/RoomV2Context";
import { formatDate } from "../utils/DateUtils";

import videoCamIcon from "../assets/videoCam.png";

import micOffIcon from "../assets/micOffControl.svg";
import micOnIcon from "../assets/micOnControl.svg";

import videoOnIcon from "../assets/videoOnControl.svg";
import videoOffIcon from "../assets/videoOffControl.svg";

import screenSharingOnIcon from "../assets/screensharingOn.svg";
import screenSharingOffIcon from "../assets/screensharingOff.svg";

import chatOnIcon from "../assets/chatOn.svg";
import chatOffIcon from "../assets/chatOff.svg";

import { Profile } from "../components/Profile";
import { StreamContext } from "../context/StreamContext";
import { StreamArea } from "../components/stream/StreamArea";

import { ToggleButton } from "../components/ToggleButton";
import { Button } from "../components/common/Button";
import { Switcher } from "../components/Switcher";
import { Link } from "react-router-dom";

export const Room = () => {
  const { room } = useContext(RoomV2Context);
  const { user } = useContext(UserV2Context);
  const toggleChat = false;
  const { mediaTracks, handleMicOn, handleScreenOn, handleWebCamOn } =
    useContext(StreamContext);

  const createAtFormated = room?.createdAt ? formatDate(room?.createdAt) : "";
  const isMicOn = mediaTracks.audioTrack.enabled;
  const isWebCamOn = mediaTracks.videoTrack.enabled;
  const isSharingScreenOn = mediaTracks.screenTrack.enabled;

  useEffect(() => {
    if (room) {
      ws.emit("join-room", {
        roomId: room?.id,
      });

      return () => {
        console.log("leave-room", room.id);
        ws.emit("leave-room", { roomId: room.id });
      };
    }
  }, [room]);

  console.log("re-render");

  return (
    <div className="grid h-screen max-h-screen grid-rows-[6rem_1fr_8rem] font-medium text-white">
      <header className="flex items-center dark:bg-darkBlue-900">
        {room && user && (
          <>
            <div className="min-w-max border-r border-opacity-60 p-4 px-8 dark:border-[#23212194]">
              <img className="block h-16 w-16" src={videoCamIcon} />
            </div>
            <div className="ml-10 flex flex-col">
              <span className="text-2xl text-[#E2E2E2]">{room?.topic}</span>
              <span className="text-[#9F9F9F]">{createAtFormated}</span>
            </div>
            <div className="ml-auto flex items-center px-7 lg:basis-[32rem]">
              <div></div>
              <div className="ml-14 lg:grow">
                {user && (
                  <Profile
                    name={user.name}
                    lastName={user.lastName}
                    picture={user.picture}
                    role={
                      user.id === room?.userId ? "Moderador" : "Participante"
                    }
                    fontSize="sm"
                    imageSize="sm"
                    marginRight="4"
                  />
                )}
              </div>
              <div className="ml-7">
                <Switcher />
              </div>
            </div>
          </>
        )}
      </header>
      <div className="flex flex-col overflow-hidden">
        <div className="flex h-full">
          {/* Left */}
          <div className="flex h-full grow flex-col">
            <div className="h-full">
              <StreamArea />
            </div>
          </div>
          {/* Right */}
          {toggleChat && (
            <div className="basis-80">
              <span> test</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-shrink-0 grow basis-auto dark:bg-darkBlue-900">
        <div className="relative flex h-full grow lg:justify-center">
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
                src={
                  isSharingScreenOn ? screenSharingOnIcon : screenSharingOffIcon
                }
              />
            </ToggleButton>
            <ToggleButton enabled={false}>
              <img className="h-6 w-6" src={false ? chatOnIcon : chatOffIcon} />
            </ToggleButton>
          </div>
          <Link to="..">
            <Button
              rounded="roundendFull"
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-red-600 px-7 py-3 hover:brightness-90 dark:bg-red-800"
            >
              Sair da reunião
            </Button>
          </Link>
        </div>

        {toggleChat && <div className="basis-80">test2</div>}
      </div>
    </div>
  );
};
