import { CssVariableHelper, cssVariableHelper } from "../cssVariableHelper";

type sliderProps = {
  variableHelper: typeof cssVariableHelper;
  sliderElement?: HTMLElement;
};

export type ISlider = {
  updateSlider: () => void;
  prevSliderItem: () => void;
  nextSliderItem: () => void;
  minIndex: number;
  endIndex: number;
};

type SliderState = {
  sliderVariableHelper: CssVariableHelper;
  getSliderContent: (slider: HTMLElement) => HTMLElement;
  getPrevButton: (slider: HTMLElement) => HTMLButtonElement | null;
  getNextButton: (slider: HTMLElement) => HTMLButtonElement | null;
  sliderMinIndex: number;
  sliderEndIndex: number;
};

type setCssVariableValueProps = {
  variableName: string;
  value: number | string;
  unit?: string;
};

type calculeSliderItemWidthProps = {
  sliderHeight: number;
  itemAspectRatio: number;

  itemMargin: number;
};

type calculateItemsPerRowProps = {
  sliderWidth: number;
  sliderItemWidth: number;
  sliderItensCount: number;
};

type calculeAspectRatioProps = {
  widthAspect: number;
  heightAspect: number;
};

const getSlider = () => document.querySelector(".slider") as HTMLElement;

const getPrevButton = (slider: HTMLElement) =>
  slider.querySelector(".slider-prev-button") as HTMLButtonElement;

const getNextButton = (slider: HTMLElement) =>
  slider.querySelector(".slider-next-button") as HTMLButtonElement;

const getSliderContent = (slider: HTMLElement) =>
  slider.querySelector(".slider-content") as HTMLElement;

export const Slider = ({
  variableHelper,
  sliderElement,
}: sliderProps): ISlider => {
  const slider = sliderElement || getSlider();

  const state: SliderState = {
    sliderVariableHelper: variableHelper(slider),
    getSliderContent: () => getSliderContent(slider),
    getPrevButton: () => getPrevButton(slider),
    getNextButton: () => getNextButton(slider),
    sliderMinIndex: 0,
    sliderEndIndex: 0,
  };

  const getCssVariableValue = (variableName: string): number => {
    const value = state.sliderVariableHelper.get({
      variableName,
    });
    return parseInt(value);
  };

  const setCssVariableValue = ({
    variableName,
    value,
    unit,
  }: setCssVariableValueProps) => {
    if (unit) value = `${value}${unit}`;

    state.sliderVariableHelper.set({
      variableName,
      value: `${value}`,
    });
  };

  const updateButtonsState = (sliderIndex: number) => {
    const prevButton = getPrevButton(slider);
    const nextButton = getNextButton(slider);

    const minIndex = state.sliderMinIndex;
    const maxIndex = state.sliderEndIndex;

    prevButton.disabled = sliderIndex === minIndex;
    nextButton.disabled = sliderIndex === maxIndex;
  };

  const updateClampIndex = (
    sliderItemsCount: number,
    sliderItemsPerRow: number,
  ) => {
    state.sliderEndIndex = calculeEndIndex(sliderItemsCount, sliderItemsPerRow);
  };

  const setSliderIndexAndButtonState = (sliderIndex: number) => {
    const clampedSliderIndex = clampSliderIndex(sliderIndex);
    setCssVariableValue({
      variableName: "slider-index",
      value: clampedSliderIndex,
    });
    updateButtonsState(clampedSliderIndex);
  };

  const clampSliderIndex = (sliderIndex: number) => {
    const minIndex = state.sliderMinIndex;
    const maxIndex = state.sliderEndIndex;

    if (sliderIndex < minIndex) sliderIndex = minIndex;
    if (sliderIndex > maxIndex) sliderIndex = maxIndex;

    return sliderIndex;
  };

  const calculeEndIndex = (
    sliderItemsCount: number,
    sliderItemsPerRow: number,
  ) => {
    return sliderItemsCount - sliderItemsPerRow;
  };

  const calculeAspectRatio = ({
    widthAspect,
    heightAspect,
  }: calculeAspectRatioProps) => {
    return widthAspect / heightAspect;
  };

  const calculeSliderItemWidth = ({
    sliderHeight,
    itemAspectRatio,
    itemMargin,
  }: calculeSliderItemWidthProps) => {
    return sliderHeight * itemAspectRatio + itemMargin;
  };

  const calculateItemsPerRow = ({
    sliderWidth,
    sliderItemWidth,
    sliderItensCount,
  }: calculateItemsPerRowProps) => {
    const maxItemsPerRowBasedWidth = Math.floor(sliderWidth / sliderItemWidth);
    const itemsPerRow = Math.min(sliderItensCount, maxItemsPerRowBasedWidth);

    return Math.max(itemsPerRow, 1);
  };

  const updateSlider = () => {
    const sliderContent = state.getSliderContent(slider);

    const sliderItensCount = sliderContent.childElementCount;

    const sliderHeight = slider.clientHeight;
    const sliderWidth = slider.clientWidth;

    const itemWidthAspect = getCssVariableValue("slider-item-width-aspect");
    const itemHeightAspect = getCssVariableValue("slider-item-height-aspect");
    const itemMargin = getCssVariableValue("slider-item-margin");

    const itemAspectRatio = calculeAspectRatio({
      widthAspect: itemWidthAspect,
      heightAspect: itemHeightAspect,
    });

    const sliderItemWidth = calculeSliderItemWidth({
      itemAspectRatio,
      itemMargin,
      sliderHeight,
    });

    const itemsPerRow = calculateItemsPerRow({
      sliderWidth,
      sliderItemWidth,
      sliderItensCount,
    });

    updateClampIndex(sliderItensCount, itemsPerRow);
    setCssVariableValue({
      variableName: "slider-height",
      value: sliderHeight,
      unit: "px",
    });
    setCssVariableValue({
      variableName: "slider-items-per-row",
      value: itemsPerRow,
    });

    const sliderIndex = getCssVariableValue("slider-index");

    setSliderIndexAndButtonState(sliderIndex);
  };

  const changeSliderIndex = (change: number) => {
    const sliderIndex = getCssVariableValue("slider-index");
    const newSliderIndex = sliderIndex + change;
    setSliderIndexAndButtonState(newSliderIndex);
  };

  const prevSliderItem = () => {
    changeSliderIndex(-1);
  };

  const nextSliderItem = () => {
    changeSliderIndex(1);
  };

  return {
    updateSlider,
    prevSliderItem,
    nextSliderItem,
    get minIndex() {
      return state.sliderMinIndex;
    },
    get endIndex() {
      return state.sliderEndIndex;
    },
  };
};
