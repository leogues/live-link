import { useContext, useEffect, useLayoutEffect } from "react";

import { UserV2Context } from "../../../context/UserV2Context";
import { StreamContext } from "../../../context/StreamContext";
import { RoomV2Context } from "../../../context/RoomV2Context";

import { UserMicrophoneVideoToggle } from "../../UserMicrophoneVideoToggle";
import { Button } from "../../common/Button";
import { Label } from "./Label";
import { VideoPlayer } from "./VideoPlayer";

import MicOnIcon from "../../../assets/micOn.svg";
import MicOffIcon from "../../../assets/micOff.svg";
import ArrowIcon from "../../../assets/setaSlider.png";
import { ChatContext } from "../../../context/ChatContext";

function debounce(callback: Function, delay: number) {
  let timeout: number;

  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

export const SliderVideos: React.FC<{
  focusedPeerId?: string;
  handleSetFocusedVideoPeerId: (peerId?: string) => void;
}> = ({ focusedPeerId, handleSetFocusedVideoPeerId }) => {
  const { user } = useContext(UserV2Context);
  const { chat } = useContext(ChatContext);
  const { peers } = useContext(RoomV2Context);
  const { localStream } = useContext(StreamContext);

  const remaingPeerLength = Object.keys(peers).filter(
    (peerId) => peerId !== focusedPeerId,
  ).length;

  const hasRemaingPeer = remaingPeerLength > 0;

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
    if (sliderIndex > sliderEndIndex) sliderIndex = sliderEndIndex;

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

    let sliderItemsPerRow = Math.min(
      sliderItemCount,
      itemsPerRowBasedWidth || 1,
    );
    setSliderVariable(sliderMask, sliderItemsPerRow);
    updateButtonsState(slider);
  };

  const changeSliderIndex = (change: number) => {
    const slider = document.querySelector(".slider") as HTMLElement;

    if (!slider) return;

    let sliderIndex = getCssVariable(slider, "--slider-index") + change;
    const sliderMask = document.querySelector(".slider-mask") as HTMLElement;
    const sliderContent = document.querySelector(
      ".slider-content",
    ) as HTMLElement;

    if (!sliderContent || !sliderMask) return;

    const sliderItemCount = sliderContent.childElementCount;
    const sliderItemsPerRow = getCssVariable(
      sliderMask,
      "--slider-items-per-row",
    );
    const sliderEndIndex = sliderItemCount - sliderItemsPerRow;

    if (sliderIndex < 0) sliderIndex = 0;
    if (sliderIndex > sliderEndIndex) sliderIndex = sliderEndIndex;

    slider.style.setProperty("--slider-index", `${sliderIndex}`);
    updateButtonsState(slider);
  };

  const prevSliderItem = () => {
    changeSliderIndex(-1);
  };

  const nextSliderItem = () => {
    changeSliderIndex(1);
  };

  useLayoutEffect(() => {
    calculateSliderItemsPerRow();
  }, [remaingPeerLength, chat.isChatOpen]);

  useEffect(() => {
    calculateSliderItemsPerRow();

    const debouncedCalculateSliderItemsPerRow = debounce(
      calculateSliderItemsPerRow,
      20,
    );

    window.addEventListener("resize", debouncedCalculateSliderItemsPerRow);

    return () => {
      window.removeEventListener("resize", debouncedCalculateSliderItemsPerRow);
    };
  }, []);

  return (
    <>
      {hasRemaingPeer && (
        <div
          data-testid="slider-videos"
          className="slider box-border h-[calc(30%-(1.25rem)*0.30)]"
        >
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
                  if (peer.user?.id !== focusedPeerId) {
                    return (
                      <Button
                        testid="peer-video"
                        className="slider-item relative flex aspect-[16/9] h-full shrink-0 justify-center  rounded-xl bg-black"
                        onClick={() =>
                          handleSetFocusedVideoPeerId(peer.user?.id)
                        }
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
  );
};
