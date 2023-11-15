import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { RoomV2Context } from "../../context/RoomV2Context";
import { UserV2Context } from "../../context/UserV2Context";
import MaximizeIcon from "../../assets/maximize.png";

import { VideoPlayer } from "./VideoPlayer";
import { StreamContext } from "../../context/StreamContext";
import { Label } from "./Label";
import { UserMicrophoneVideoToggle } from "../UserMicrophoneVideoToggle";
import MicOnIcon from "../../assets/micOn.svg";
import MicOffIcon from "../../assets/micOff.svg";
import ArrowIcon from "../../assets/setaSlider.png";
import { Button } from "../common/Button";
import { ChatContext } from "../../context/ChatContext";

function debounce(callback: Function, delay: number) {
  let timeout: number;

  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

export const StreamArea: React.FC = () => {
  const { user } = useContext(UserV2Context);
  const { chat } = useContext(ChatContext);
  const { peers, room } = useContext(RoomV2Context);
  const { localStream } = useContext(StreamContext);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedPeerId, setFocusedPeerId] = useState<string>();

  if (!focusedPeerId || !peers[focusedPeerId]?.user?.id) {
    const focusedPeerIdFromPeers =
      Object.keys(peers).find((peerId) => peerId === room?.userId) ??
      Object.keys(peers)[0];

    if (focusedPeerIdFromPeers && peers[focusedPeerIdFromPeers]) {
      setFocusedPeerId(focusedPeerIdFromPeers);
    }
  }

  const focusedPeer = focusedPeerId ? peers[focusedPeerId] : undefined;
  const remaingPeerLength = Object.keys(peers).filter(
    (peerId) => peerId !== focusedPeerId,
  ).length;

  console.log({ remaingPeerLength });
  const hasRemaingPeer = remaingPeerLength > 0;

  const handleSetFocusedVideoPeerId = (peerId?: string) => {
    if (peerId && peers[peerId]) {
      setFocusedPeerId(peerId);
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getCssVariable = (element: HTMLElement, property: string): number => {
    return parseInt(getComputedStyle(element).getPropertyValue(property));
  };

  const calculateSliderItemWidth = (
    sliderMask: HTMLElement,
    aspectRatio: number,
    sliderItemMargin: number,
  ): number => {
    const sliderMaskHeight = sliderMask.clientHeight;
    return sliderMaskHeight * aspectRatio + sliderItemMargin;
  };

  const setSliderVariable = (
    slider: HTMLElement,
    sliderItemsPerRow: number,
  ): void => {
    slider.style.setProperty("--slider-height", `${slider.clientHeight}px`);
    slider.style.setProperty("--slider-items-per-row", `${sliderItemsPerRow}`);
  };

  const updateButtonsState = (slider: HTMLElement) => {
    const prevButton = document.querySelector(
      ".slider-button-prev",
    ) as HTMLButtonElement;
    const nextButton = document.querySelector(
      ".slider-button-next",
    ) as HTMLButtonElement;
    const sliderMask = document.querySelector(".slider-mask") as HTMLElement;
    const sliderContent = document.querySelector(
      ".slider-content",
    ) as HTMLElement;

    const sliderItemCount = sliderContent.childElementCount;
    const sliderItemsPerRow = getCssVariable(
      sliderMask,
      "--slider-items-per-row",
    );

    let sliderIndex = getCssVariable(slider, "--slider-index");
    const sliderEndIndex = sliderItemCount - sliderItemsPerRow;

    if (sliderIndex < 0) sliderIndex = 0;
    if (sliderIndex > sliderEndIndex) {
      sliderIndex = sliderEndIndex;
    }

    slider.style.setProperty("--slider-index", `${sliderIndex}`);

    prevButton.disabled = sliderIndex === 0;

    nextButton.disabled = sliderIndex === sliderEndIndex;
  };

  const calculateSliderItemsPerRow = () => {
    const slider = document.querySelector(".slider") as HTMLElement;
    const sliderMask = document.querySelector(".slider-mask") as HTMLElement;
    const sliderContent = document.querySelector(
      ".slider-content",
    ) as HTMLElement;

    if (!slider || !sliderMask || !sliderContent) return;

    const sliderItemCount = sliderContent.childElementCount;

    const sliderWidthAspect = getCssVariable(
      sliderMask,
      "--slider-item-width-aspect",
    );

    const sliderHeightAspect = getCssVariable(
      sliderMask,
      "--slider-item-height-aspect",
    );

    const sliderItemAspectRatio = sliderWidthAspect / sliderHeightAspect;

    const sliderItemMargin = getCssVariable(sliderMask, "--slider-item-margin");

    const sliderWidth = slider.clientWidth;

    const sliderItemWidth = calculateSliderItemWidth(
      sliderMask,
      sliderItemAspectRatio,
      sliderItemMargin,
    );

    const itemsPerRowBasedWidth = Math.floor(sliderWidth / sliderItemWidth);

    const sliderItemsPerRow =
      sliderItemCount < itemsPerRowBasedWidth
        ? sliderItemCount
        : itemsPerRowBasedWidth;

    setSliderVariable(sliderMask, sliderItemsPerRow);

    updateButtonsState(slider);
  };

  const prevSliderItem = () => {
    const slider = document.querySelector(".slider") as HTMLElement;
    if (!slider) return;

    let sliderIndex = getCssVariable(slider, "--slider-index") - 1;

    if (sliderIndex < 0) sliderIndex = 0;

    slider.style.setProperty("--slider-index", `${sliderIndex}`);

    updateButtonsState(slider);
  };

  const nextSliderItem = () => {
    const slider = document.querySelector(".slider") as HTMLElement;
    const sliderMask = document.querySelector(".slider-mask") as HTMLElement;
    const sliderContent = document.querySelector(
      ".slider-content",
    ) as HTMLElement;

    if (!slider || !sliderContent || !sliderMask) return;

    const sliderItemCount = sliderContent.childElementCount;
    const sliderItemsPerRow = getCssVariable(
      sliderMask,
      "--slider-items-per-row",
    );

    const sliderEndIndex = sliderItemCount - sliderItemsPerRow;

    let sliderIndex = getCssVariable(slider, "--slider-index") + 1;

    if (sliderIndex > sliderEndIndex) {
      sliderIndex = sliderEndIndex;
    }

    slider.style.setProperty("--slider-index", `${sliderIndex}`);

    updateButtonsState(slider);
  };

  useLayoutEffect(() => {
    calculateSliderItemsPerRow();
  }, [remaingPeerLength, chat.isChatOpen]);

  useEffect(() => {
    calculateSliderItemsPerRow();

    const debouncedCalculateSliderItemsPerRow = debounce(
      calculateSliderItemsPerRow,
      100,
    );

    window.addEventListener("resize", debouncedCalculateSliderItemsPerRow);

    return () => {
      window.removeEventListener("resize", debouncedCalculateSliderItemsPerRow);
    };
  }, []);

  return (
    <div className="flex h-full flex-col gap-5 p-3 text-white">
      {!!Object.values(peers).length && (
        <>
          <div className="box-border flex min-h-0 grow justify-center">
            {focusedPeer && (
              <div
                data-fullscreen={isFullscreen}
                className="relative flex aspect-[21/9] h-full max-h-full max-w-full 
              justify-center overflow-hidden rounded-xl bg-black data-[fullscreen=true]:fixed 
              data-[fullscreen=true]:left-0 data-[fullscreen=true]:top-0 data-[fullscreen=true]:z-50 
              data-[fullscreen=true]:h-full data-[fullscreen=true]:w-full data-[fullscreen=true]:rounded-none data-[fullscreen=true]:bg-black"
              >
                {focusedPeer.user?.id === user?.id && localStream.current ? (
                  <VideoPlayer stream={localStream.current} />
                ) : focusedPeer.stream ? (
                  <VideoPlayer stream={focusedPeer.stream} />
                ) : null}

                <div className="absolute right-5 top-4">
                  <Button onClick={handleFullscreen}>
                    <Label padding="rounded">
                      <img height={20} width={20} src={MaximizeIcon} />
                    </Label>
                  </Button>
                </div>
                <div className="absolute bottom-5 left-7 flex gap-1">
                  <Label>
                    <span>{focusedPeer.user?.name}</span>
                    <span>{focusedPeer.user?.lastName}</span>
                  </Label>
                </div>

                <div className="absolute bottom-5 right-7">
                  <UserMicrophoneVideoToggle
                    bg="toggle"
                    toggle={focusedPeer.isMicOn}
                  >
                    <img
                      src={focusedPeer.isMicOn ? MicOnIcon : MicOffIcon}
                      alt="Microfone status"
                    />
                  </UserMicrophoneVideoToggle>
                </div>
              </div>
            )}
          </div>
          {hasRemaingPeer && (
            <div className="slider box-border h-[calc(30%-(1.25rem)*0.30)]">
              <div className="slider-mask relative mx-auto h-full min-h-0 ">
                <div className="h-full min-h-0 overflow-x-hidden">
                  <Button
                    className="slider-button-prev group absolute left-0 top-0 z-10 flex h-full w-7 -translate-x-full items-center justify-center  disabled:hidden"
                    onClick={prevSliderItem}
                  >
                    <img
                      className="h-5 w-4 -rotate-180 transition-all duration-500 group-hover:scale-125"
                      src={ArrowIcon}
                    />
                  </Button>
                  <div className="slider-content flex h-full max-h-full transition-transform duration-300">
                    {Object.values(peers).map((peer) => {
                      if (peer.user?.id !== focusedPeer?.user?.id) {
                        return (
                          <Button
                            className="slider-item relative flex aspect-[16/9] h-full shrink-0 justify-center  rounded-xl bg-black"
                            onClick={() =>
                              handleSetFocusedVideoPeerId(peer.user?.id)
                            }
                            key={peer.user?.id}
                          >
                            {peer.user?.id === user?.id &&
                            localStream.current ? (
                              <VideoPlayer stream={localStream.current} />
                            ) : peer.stream ? (
                              <VideoPlayer stream={peer.stream} />
                            ) : null}

                            <div className="absolute bottom-5 right-5">
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

                            <div className="absolute bottom-5 left-5">
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
                  <Button
                    className="slider-button-next group absolute right-0 top-0 z-10 flex h-full w-7 translate-x-full items-center justify-center disabled:hidden"
                    onClick={nextSliderItem}
                  >
                    <img
                      className="h-5 w-4 transition-all duration-500 group-hover:scale-125"
                      src={ArrowIcon}
                    />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
