import { useContext, useEffect, useLayoutEffect, useRef } from "react";

import { UserV2Context } from "../../../context/UserV2Context";
import { StreamContext } from "../../../context/StreamContext";
import { RoomV2Context } from "../../../context/RoomV2Context";

import { UserMicrophoneVideoToggle } from "../../UserMicrophoneVideoToggle";
import { Button } from "../../common/Button";
import { Label } from "./Label";
import { VideoPlayer } from "./VideoPlayer";

import MicOnIcon from "../../../assets/micOn.png";
import MicOffIcon from "../../../assets/micOff.png";
import ArrowIcon from "../../../assets/setaSlider.png";
import { ChatContext } from "../../../context/ChatContext";

import { ISlider, Slider } from "../../../utils/slider/slider";
import { cssVariableHelper } from "../../../utils/cssVariableHelper";
import { debounce } from "../../../utils/debounce";

export const SliderVideos: React.FC<{
  focusedPeerId?: string;
  remaingPeerLength: number;
  handleSetFocusedVideoPeerId: (peerId?: string) => void;
}> = ({ focusedPeerId, remaingPeerLength, handleSetFocusedVideoPeerId }) => {
  const { user } = useContext(UserV2Context);
  const { chat } = useContext(ChatContext);
  const { peers } = useContext(RoomV2Context);
  const { localStream } = useContext(StreamContext);

  const slider = useRef<ISlider | null>(null);

  useEffect(() => {
    slider.current = Slider({
      variableHelper: cssVariableHelper,
    });

    return () => {
      slider.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    slider.current?.updateSlider();
  }, [remaingPeerLength, chat.isChatOpen]);

  useEffect(() => {
    slider.current?.updateSlider();

    const debounceUpdateSlider = debounce(20, slider.current?.updateSlider);
    window.addEventListener("resize", debounceUpdateSlider);

    return () => {
      window.removeEventListener("resize", debounceUpdateSlider);
    };
  }, []);

  return (
    <div
      data-testid="slider-videos"
      className="slider box-border h-[calc(30%-(1.25rem)*0.30)]"
    >
      <div className="slider-mask relative mx-auto h-full min-h-0 ">
        <div className="h-full min-h-0 overflow-x-hidden">
          <Button
            className="slider-prev-button group absolute left-0 top-0 z-10 flex h-full w-7 -translate-x-full items-center justify-center  disabled:hidden"
            onClick={slider.current?.prevSliderItem}
          >
            <img
              className="h-5 w-4 -rotate-180 transition-all duration-500 group-hover:scale-125"
              src={ArrowIcon}
            />
          </Button>
          <div className="slider-content flex h-full max-h-full transition-transform duration-300">
            {Object.values(peers).map((peer) => {
              if (peer.user?.id !== focusedPeerId) {
                return (
                  <Button
                    testid="peer-video"
                    className="slider-item relative flex h-full shrink-0 justify-center  rounded-xl bg-black"
                    onClick={() => handleSetFocusedVideoPeerId(peer.user?.id)}
                    key={peer.user?.id}
                  >
                    {peer.user?.id === user?.id && localStream.current ? (
                      <VideoPlayer stream={localStream.current} />
                    ) : peer.stream ? (
                      <VideoPlayer stream={peer.stream} />
                    ) : null}

                    <div className="absolute bottom-5 right-5 z-10">
                      <UserMicrophoneVideoToggle
                        bg="toggle"
                        toggle={peer.isMicOn}
                      >
                        <img
                          height={17}
                          width={17}
                          src={peer.isMicOn ? MicOnIcon : MicOffIcon}
                          alt="Microfone status"
                        />
                      </UserMicrophoneVideoToggle>
                    </div>

                    {!(peer.isSharingScreenOn || peer.isWebCamOn) && (
                      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
                        <div className="h-14 w-14 overflow-hidden rounded-full">
                          <img src={peer.user?.picture} />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-5 left-5 z-10">
                      <Label size="sm">
                        <span>{peer?.user?.name}</span>
                        <span>{peer?.user?.lastName}</span>{" "}
                      </Label>
                    </div>
                  </Button>
                );
              }
              return null;
            })}
            {Object.values(peers).map((peer) => {
              if (peer.user?.id !== focusedPeerId) {
                return (
                  <Button
                    testid="peer-video"
                    className="slider-item relative flex h-full shrink-0 justify-center  rounded-xl bg-black"
                    onClick={() => handleSetFocusedVideoPeerId(peer.user?.id)}
                    key={peer.user?.id}
                  >
                    {peer.user?.id === user?.id && localStream.current ? (
                      <VideoPlayer stream={localStream.current} />
                    ) : peer.stream ? (
                      <VideoPlayer stream={peer.stream} />
                    ) : null}

                    <div className="absolute bottom-5 right-5 z-10">
                      <UserMicrophoneVideoToggle
                        bg="toggle"
                        toggle={peer.isMicOn}
                      >
                        <img
                          height={17}
                          width={17}
                          src={peer.isMicOn ? MicOnIcon : MicOffIcon}
                          alt="Microfone status"
                        />
                      </UserMicrophoneVideoToggle>
                    </div>

                    {!(peer.isSharingScreenOn || peer.isWebCamOn) && (
                      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
                        <div className="h-14 w-14 overflow-hidden rounded-full">
                          <img src={peer.user?.picture} />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-5 left-5 z-10">
                      <Label size="sm">
                        <span>{peer?.user?.name}</span>
                        <span>{peer?.user?.lastName}</span>{" "}
                      </Label>
                    </div>
                  </Button>
                );
              }
              return null;
            })}
            {Object.values(peers).map((peer) => {
              if (peer.user?.id !== focusedPeerId) {
                return (
                  <Button
                    testid="peer-video"
                    className="slider-item relative flex h-full shrink-0 justify-center  rounded-xl bg-black"
                    onClick={() => handleSetFocusedVideoPeerId(peer.user?.id)}
                    key={peer.user?.id}
                  >
                    {peer.user?.id === user?.id && localStream.current ? (
                      <VideoPlayer stream={localStream.current} />
                    ) : peer.stream ? (
                      <VideoPlayer stream={peer.stream} />
                    ) : null}

                    <div className="absolute bottom-5 right-5 z-10">
                      <UserMicrophoneVideoToggle
                        bg="toggle"
                        toggle={peer.isMicOn}
                      >
                        <img
                          height={17}
                          width={17}
                          src={peer.isMicOn ? MicOnIcon : MicOffIcon}
                          alt="Microfone status"
                        />
                      </UserMicrophoneVideoToggle>
                    </div>

                    {!(peer.isSharingScreenOn || peer.isWebCamOn) && (
                      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
                        <div className="h-14 w-14 overflow-hidden rounded-full">
                          <img src={peer.user?.picture} />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-5 left-5 z-10">
                      <Label size="sm">
                        <span>{peer?.user?.name}</span>
                        <span>{peer?.user?.lastName}</span>{" "}
                      </Label>
                    </div>
                  </Button>
                );
              }
              return null;
            })}
            {Object.values(peers).map((peer) => {
              if (peer.user?.id !== focusedPeerId) {
                return (
                  <Button
                    testid="peer-video"
                    className="slider-item relative flex h-full shrink-0 justify-center  rounded-xl bg-black"
                    onClick={() => handleSetFocusedVideoPeerId(peer.user?.id)}
                    key={peer.user?.id}
                  >
                    {peer.user?.id === user?.id && localStream.current ? (
                      <VideoPlayer stream={localStream.current} />
                    ) : peer.stream ? (
                      <VideoPlayer stream={peer.stream} />
                    ) : null}

                    <div className="absolute bottom-5 right-5 z-10">
                      <UserMicrophoneVideoToggle
                        bg="toggle"
                        toggle={peer.isMicOn}
                      >
                        <img
                          height={17}
                          width={17}
                          src={peer.isMicOn ? MicOnIcon : MicOffIcon}
                          alt="Microfone status"
                        />
                      </UserMicrophoneVideoToggle>
                    </div>

                    {!(peer.isSharingScreenOn || peer.isWebCamOn) && (
                      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
                        <div className="h-14 w-14 overflow-hidden rounded-full">
                          <img src={peer.user?.picture} />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-5 left-5 z-10">
                      <Label size="sm">
                        <span>{peer?.user?.name}</span>
                        <span>{peer?.user?.lastName}</span>{" "}
                      </Label>
                    </div>
                  </Button>
                );
              }
              return null;
            })}
            {Object.values(peers).map((peer) => {
              if (peer.user?.id !== focusedPeerId) {
                return (
                  <Button
                    testid="peer-video"
                    className="slider-item relative flex h-full shrink-0 justify-center  rounded-xl bg-black"
                    onClick={() => handleSetFocusedVideoPeerId(peer.user?.id)}
                    key={peer.user?.id}
                  >
                    {peer.user?.id === user?.id && localStream.current ? (
                      <VideoPlayer stream={localStream.current} />
                    ) : peer.stream ? (
                      <VideoPlayer stream={peer.stream} />
                    ) : null}

                    <div className="absolute bottom-5 right-5 z-10">
                      <UserMicrophoneVideoToggle
                        bg="toggle"
                        toggle={peer.isMicOn}
                      >
                        <img
                          height={17}
                          width={17}
                          src={peer.isMicOn ? MicOnIcon : MicOffIcon}
                          alt="Microfone status"
                        />
                      </UserMicrophoneVideoToggle>
                    </div>

                    {!(peer.isSharingScreenOn || peer.isWebCamOn) && (
                      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
                        <div className="h-14 w-14 overflow-hidden rounded-full">
                          <img src={peer.user?.picture} />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-5 left-5 z-10">
                      <Label size="sm">
                        <span>{peer?.user?.name}</span>
                        <span>{peer?.user?.lastName}</span>{" "}
                      </Label>
                    </div>
                  </Button>
                );
              }
              return null;
            })}
          </div>

          <div className="slider-indicator absolute -bottom-1.5 left-1/2 h-1 w-80 max-w-[50%] -translate-x-1/2 translate-y-1/2 overflow-hidden rounded-[3rem] bg-[#DEE1E7] ">
            <div className="slider-indicator-progress-bar h-full rounded-[3rem] bg-blue-800 px-[2px] transition-transform duration-300"></div>
          </div>

          <Button
            className="slider-next-button group absolute right-0 top-0 z-10 flex h-full w-7 translate-x-full items-center justify-center disabled:hidden"
            onClick={slider.current?.nextSliderItem}
          >
            <img
              className="h-5 w-4 transition-all duration-500 group-hover:scale-125"
              src={ArrowIcon}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
