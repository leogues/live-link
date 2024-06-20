import { useContext, useEffect, useLayoutEffect, useRef } from "react";

import { ChatContext } from "../../../context/ChatContext";
import { RoomV2Context } from "../../../context/RoomV2Context";
import { MinizarIcon } from "../../../icons/Minimizar";
import { cssVariableHelper } from "../../../utils/cssVariableHelper";
import { debounce } from "../../../utils/debounce";
import { ISlider, Slider } from "../../../utils/slider/slider";
import { Button } from "../../common/Button";
import { SliderVideo } from "./SliderVideo";

export const SliderVideos: React.FC<{
  focusedPeerId?: string;
  remaingPeerLength: number;
  handleSetFocusedVideoPeerId: (peerId?: string) => void;
}> = ({ focusedPeerId, remaingPeerLength, handleSetFocusedVideoPeerId }) => {
  const { chat } = useContext(ChatContext);
  const { peers } = useContext(RoomV2Context);

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
            <MinizarIcon
              width={20}
              height={20}
              className="-rotate-90 transition-all duration-500 group-hover:scale-125"
            />
          </Button>
          <div className="slider-content flex h-full max-h-full transition-transform duration-300">
            {Object.values(peers).map((peer) => {
              return (
                <SliderVideo
                  key={peer.user?.id}
                  peer={peer}
                  focusedPeerId={focusedPeerId}
                  handleSetFocusedVideoPeerId={handleSetFocusedVideoPeerId}
                />
              );
            })}
          </div>

          <div className="slider-indicator absolute -bottom-1.5 left-1/2 h-1 w-80 max-w-[50%] -translate-x-1/2 translate-y-1/2 overflow-hidden rounded-[3rem] bg-[#DEE1E7] ">
            <div className="slider-indicator-progress-bar h-full rounded-[3rem] bg-blue-800 px-[2px] transition-transform duration-300"></div>
          </div>

          <Button
            className="slider-next-button group absolute right-0 top-0 z-10 flex h-full w-7 translate-x-full items-center justify-center disabled:hidden"
            onClick={slider.current?.nextSliderItem}
          >
            <MinizarIcon
              width={20}
              height={20}
              className="rotate-90 transition-all duration-500 group-hover:scale-125"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
