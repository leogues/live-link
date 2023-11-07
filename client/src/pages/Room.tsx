import { useContext, useEffect } from "react";

import { ws } from "../services/ws";
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

import inviteUser from "../assets/userAdd.svg";
import minimizarIcon from "../assets/setaCima.svg";

import { Profile } from "../components/Profile";
import { StreamContext } from "../context/StreamContext";
import { StreamArea } from "../components/stream/StreamArea";

import { ToggleButton } from "../components/ToggleButton";
import { Button } from "../components/common/Button";
import { Switcher } from "../components/Switcher";
import { Link } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";
import { ChatInput } from "../components/chat/ChatInput";

const maxPeersImgs = 4;

export const Room = () => {
  const { room, peers } = useContext(RoomV2Context);
  const { user } = useContext(UserV2Context);
  const { chat, toggleChat } = useContext(ChatContext);
  const { mediaTracks, handleMicOn, handleScreenOn, handleWebCamOn } =
    useContext(StreamContext);

  const renderedPeersImg = Object.values(peers).slice(0, maxPeersImgs);
  const remainingPeers = Object.values(peers).slice(maxPeersImgs);
  const hasRemainingPeers = remainingPeers.length > 0;

  const createAtFormated = room?.createdAt ? formatDate(room?.createdAt) : "";
  const isMicOn = mediaTracks.audioTrack?.enabled;
  const isWebCamOn = mediaTracks.videoTrack?.enabled;
  const isSharingScreenOn = mediaTracks.screenTrack?.enabled;

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
      <header className="flex items-center border dark:border-[#3333] dark:border-opacity-30 dark:bg-darkBlue-900">
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
              <div className="flex">
                {peers &&
                  renderedPeersImg.map((peer) => {
                    return (
                      <div className="-m-[0.4rem] h-12 w-12 min-w-max overflow-hidden rounded-full border-[3px] dark:border-darkBlue-900">
                        <img
                          className="block h-full"
                          src={peer.user?.picture}
                        />
                      </div>
                    );
                  })}
                {hasRemainingPeers && (
                  <div className="-m-[0.4rem] flex h-12 w-12 min-w-max items-center justify-center overflow-hidden rounded-full border-[3px] dark:border-darkBlue-900 dark:bg-darkBlue-400">
                    <span className="-ml-1 text-sm font-semibold dark:text-blue-700">
                      +{remainingPeers.length}
                    </span>
                  </div>
                )}
              </div>
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
          {chat.isChatOpen && (
            <div className="flex basis-[22rem] flex-col shadow-md dark:bg-darkBlue-600">
              <div className="flex basis-[40%] flex-col">
                <header className="flex h-14 items-center justify-between px-6 py-2 dark:bg-darkBlue-900">
                  <span>Participantes</span>
                  <div className="flex gap-2">
                    <Button className="flex gap-2 bg-blue-50 px-5 py-[0.6rem] text-blue-800 dark:bg-darkBlue-400 dark:text-blue-700">
                      <span className="text-sm">Convidar</span>
                      <img width={18} src={inviteUser} />
                    </Button>
                    <Button>
                      <img src={minimizarIcon} />
                    </Button>
                  </div>
                </header>
                <div className="max-h-full grow overflow-auto"></div>
              </div>
              <div className="flex-1">
                <header className="flex h-14 items-center justify-between px-6 py-2 dark:bg-darkBlue-900">
                  <span>Chats</span>
                  <div className="flex gap-2">
                    <Button>
                      <img src={minimizarIcon} />
                    </Button>
                  </div>
                </header>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-shrink-0 grow basis-auto  dark:bg-darkBlue-900">
        <div className="relative flex h-full grow border dark:border-[#1F2335] lg:justify-center">
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
          <Link to="..">
            <Button
              rounded="roundendFull"
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-red-600 px-7 py-3 hover:brightness-90 dark:bg-red-800"
            >
              Sair da reunião
            </Button>
          </Link>
        </div>

        {chat.isChatOpen && (
          <div className="flex basis-[22rem] items-center justify-center border dark:border-[#1F2335]">
            <ChatInput />
          </div>
        )}
      </div>
    </div>
  );
};
