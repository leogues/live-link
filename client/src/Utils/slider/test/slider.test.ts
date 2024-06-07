import { describe, expect, test } from "vitest";

import { ISlider, Slider } from "../slider";
import { variableHelper, variableMock } from "./variableHelperMock";

type mockPropertyProps = {
  element: HTMLElement;
  propertyName: string;
};

type mockSetPropertyProps = mockPropertyProps & {
  propertyValue: any;
};

type mockRestorePropertyProps = mockPropertyProps & {
  originalPropertyValue: any;
};

type IOriginalProperties = mockRestorePropertyProps[];

const mockElementProperties = () => {
  const originalProperties: IOriginalProperties = [];

  const mockElementProperty = ({
    element,
    propertyName,
    propertyValue,
  }: mockSetPropertyProps) => {
    //@ts-ignore
    const originalValue: string = element[propertyName];
    originalProperties.push({
      element,
      propertyName,
      originalPropertyValue: originalValue,
    });
    Object.defineProperty(element, propertyName, {
      value: propertyValue,
      configurable: true,
    });
  };

  const restoreElementProperties = () => {
    originalProperties.forEach(
      ({
        element,
        propertyName,
        originalPropertyValue,
      }: mockRestorePropertyProps) => {
        Object.defineProperty(element, propertyName, {
          value: originalPropertyValue,
          configurable: true,
        });
      },
    );
    originalProperties.length = 0;
  };

  return { mockElementProperty, restoreElementProperties };
};

describe("slider", () => {
  let slider: ISlider;
  let sliderElement: HTMLElement;
  let sliderPrevButtonElement: HTMLButtonElement;
  let sliderNextButtonElement: HTMLButtonElement;
  let sliderContentElement: HTMLElement;

  let sliderWidth: number;
  let sliderHeight: number;
  let sliderChildCount: number;

  const { mockElementProperty, restoreElementProperties } =
    mockElementProperties();

  beforeEach(() => {
    sliderElement = document.createElement("div");
    sliderElement.className = "slider";

    sliderPrevButtonElement = document.createElement("button");
    sliderPrevButtonElement.className = "slider-prev-button";
    sliderElement.appendChild(sliderPrevButtonElement);

    sliderNextButtonElement = document.createElement("button");
    sliderNextButtonElement.className = "slider-next-button";
    sliderElement.appendChild(sliderNextButtonElement);

    sliderContentElement = document.createElement("div");
    sliderContentElement.className = "slider-content";
    sliderElement.appendChild(sliderContentElement);

    document.body.appendChild(sliderElement);

    slider = Slider({
      variableHelper: variableHelper,
      sliderElement: sliderElement,
    });
  });

  afterEach(() => {
    restoreElementProperties();
  });

  test("slider buttons are disabled with only one item", () => {
    sliderChildCount = 1;
    mockElementProperty({
      element: sliderContentElement,
      propertyName: "childElementCount",
      propertyValue: sliderChildCount,
    });

    slider.updateSlider();

    expect(sliderPrevButtonElement).toBeDisabled();
    expect(sliderNextButtonElement).toBeDisabled();
  });

  test("slider buttons are disabled when the total size of items is smaller than the slider width", () => {
    sliderWidth = 1000;
    sliderHeight = 150;
    sliderChildCount = 3;

    // Calculation: (sliderHeight * aspect ratio + itemMargin) * sliderChildCount = total size of items
    // In this case: (150(height) * 16/9(aspect-ratio) + 20px) * 3(quantity of items) = 860(total size of items) which is less than 1000(width)
    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    mockElementProperty({
      element: sliderContentElement,
      propertyName: "childElementCount",
      propertyValue: sliderChildCount,
    });

    slider.updateSlider();

    expect(sliderPrevButtonElement).toBeDisabled();
    expect(sliderNextButtonElement).toBeDisabled();
  });

  test("slider next button are enabled when total item size exceeds slider width", () => {
    // Calculation: (sliderHeight * aspect ratio + itemMargin) * sliderChildCount = total size of items
    //In this case: (150(height) * 16/9(aspect-ratio) + 20px(itemMargin)) * 4(quantity of items) = 1146.67(total size of items) which exceeds the 1000(width)

    sliderWidth = 1000;
    sliderHeight = 150;
    sliderChildCount = 4;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    mockElementProperty({
      element: sliderContentElement,
      propertyName: "childElementCount",
      propertyValue: sliderChildCount,
    });

    slider.updateSlider();

    expect(sliderPrevButtonElement).toBeDisabled();
    expect(sliderNextButtonElement).toBeEnabled();
  });

  test("handles next button behavior when items exceed slider width", () => {
    sliderWidth = 1000;
    sliderHeight = 150;
    sliderChildCount = 4;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    mockElementProperty({
      element: sliderContentElement,
      propertyName: "childElementCount",
      propertyValue: sliderChildCount,
    });

    slider.updateSlider();

    expect(slider.endIndex).toEqual(1);

    expect(variableMock["slider-index"]).equal("0");
    expect(sliderNextButtonElement).toBeEnabled();

    slider.nextSliderItem();

    expect(variableMock["slider-index"]).equal("1");
    expect(sliderNextButtonElement).toBeDisabled();

    slider.nextSliderItem();

    expect(variableMock["slider-index"]).equal("1");
    expect(sliderNextButtonElement).toBeDisabled();
  });

  test("handles prev button behavior when items exceed slider width", () => {
    sliderWidth = 1000;
    sliderHeight = 150;
    sliderChildCount = 4;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    mockElementProperty({
      element: sliderContentElement,
      propertyName: "childElementCount",
      propertyValue: sliderChildCount,
    });

    slider.updateSlider();

    expect(variableMock["slider-index"]).equal("1");
    expect(sliderPrevButtonElement).toBeEnabled();

    slider.prevSliderItem();

    expect(variableMock["slider-index"]).equal("0");
    expect(sliderPrevButtonElement).toBeDisabled();

    slider.prevSliderItem();

    expect(variableMock["slider-index"]).equal("0");
    expect(sliderPrevButtonElement).toBeDisabled();
  });

  test("slider responsively adjusts its height", () => {
    // Calculation: (sliderHeight * aspect ratio + itemMargin) = item size
    // Explanation: Calculate the size of each item considering the slider's height, aspect ratio, and item margin.

    // Calculation: width / itemSize = itemsPerRowPerWidth
    // Explanation: Calculate the number of items that can fit in a row based on the slider's width and the calculated item size.

    // if itemsPerRowPerWidth > sliderChildCount, then itemsPerRow = sliderChildCount
    // Explanation: If the calculated number of items per row exceeds the total number of slider items, set items per row to the total slider items.

    // Calculation: sliderChildCount - itemsPerRow = remainingItems
    // Explanation: Calculate the remaining items that won't fit in the last row by subtracting the items per row from the total number of slider items.
    sliderWidth = 1000;
    sliderHeight = 150;
    sliderChildCount = 10;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    mockElementProperty({
      element: sliderContentElement,
      propertyName: "childElementCount",
      propertyValue: sliderChildCount,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("3");
    expect(slider.endIndex).equal(7);

    sliderHeight = 100;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("5");
    expect(slider.endIndex).equal(5);

    sliderHeight = 50;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("9");
    expect(slider.endIndex).equal(1);

    sliderHeight = 25;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("10");
    expect(slider.endIndex).equal(0);
  });

  test("slider responsively adjusts its width", () => {
    // Calculation: (sliderHeight * aspect ratio + itemMargin) = item size
    // Explanation: Calculate the size of each item considering the slider's height, aspect ratio, and item margin.

    // Calculation: width / itemSize = itemsPerRowPerWidth
    // Explanation: Calculate the number of items that can fit in a row based on the slider's width and the calculated item size.

    // if itemsPerRowPerWidth > sliderChildCount, then itemsPerRow = sliderChildCount
    // Explanation: If the calculated number of items per row exceeds the total number of slider items, set items per row to the total slider items.

    // Calculation: sliderChildCount - itemsPerRow = remainingItems
    // Explanation: Calculate the remaining items that won't fit in the last row by subtracting the items per row from the total number of slider items.
    sliderWidth = 2000;
    sliderHeight = 150;
    sliderChildCount = 10;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientHeight",
      propertyValue: sliderHeight,
    });

    mockElementProperty({
      element: sliderContentElement,
      propertyName: "childElementCount",
      propertyValue: sliderChildCount,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("6");
    expect(slider.endIndex).equal(4);

    sliderWidth = 1000;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("3");
    expect(slider.endIndex).equal(7);

    sliderWidth = 750;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("2");
    expect(slider.endIndex).equal(8);

    sliderWidth = 500;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("1");
    expect(slider.endIndex).equal(9);

    sliderWidth = 250;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("1");
    expect(slider.endIndex).equal(9);

    sliderWidth = 1;

    mockElementProperty({
      element: sliderElement,
      propertyName: "clientWidth",
      propertyValue: sliderWidth,
    });

    slider.updateSlider();

    expect(variableMock["slider-items-per-row"]).equal("1");
    expect(slider.endIndex).equal(9);
  });
});
