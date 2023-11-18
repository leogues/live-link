import { describe, test, expect, vitest } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { Room } from "../Room";
import { MemoryRouter } from "react-router-dom";
import { streamCustomProviderProps } from "./StreamMock";
import { ChatProvider } from "../../context/ChatContext";

describe("Room footer controls tests", () => {
  test("microphone button calls the function", () => {
    const handleMicOn = vitest.fn();

    render(
      <MemoryRouter>
        {streamCustomProviderProps({
          children: <Room />,
          providerProps: { handleMicOn },
        })}
      </MemoryRouter>,
    );

    const micToggleButton = screen.getByTestId("mic-toggle");

    fireEvent(
      micToggleButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(handleMicOn).toBeCalled();
  });

  test("webcam button calls the function", () => {
    const handleWebCamOn = vitest.fn();

    render(
      <MemoryRouter>
        {streamCustomProviderProps({
          children: <Room />,
          providerProps: { handleWebCamOn },
        })}
      </MemoryRouter>,
    );

    const webCamToggleButton = screen.getByTestId("web-cam-toggle");

    fireEvent(
      webCamToggleButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(handleWebCamOn).toBeCalled();
  });

  test("sharingscreen button calls the function", () => {
    const handleScreenOn = vitest.fn();

    render(
      <MemoryRouter>
        {streamCustomProviderProps({
          children: <Room />,
          providerProps: { handleScreenOn },
        })}
      </MemoryRouter>,
    );

    const webCamToggleButton = screen.getByTestId("sharingscreen-toggle");

    fireEvent(
      webCamToggleButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(handleScreenOn).toBeCalled();
  });

  test("sharingscreen button calls the function", () => {
    const handleScreenOn = vitest.fn();

    render(
      <MemoryRouter>
        {streamCustomProviderProps({
          children: <Room />,
          providerProps: { handleScreenOn },
        })}
      </MemoryRouter>,
    );

    const sharingscreenToggleButton = screen.getByTestId(
      "sharingscreen-toggle",
    );

    fireEvent(
      sharingscreenToggleButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(handleScreenOn).toBeCalled();
  });

  test("chat button toggles chat", () => {
    render(
      <MemoryRouter>
        <ChatProvider>
          <Room />
        </ChatProvider>
      </MemoryRouter>,
    );

    const chatToggleButton = screen.getByTestId("chat-toggle");

    fireEvent.click(chatToggleButton);

    let textarea = screen.queryByRole("textbox");
    expect(textarea).not.toBeInTheDocument();

    fireEvent.click(chatToggleButton);

    textarea = screen.queryByRole("textbox");

    expect(textarea).toBeInTheDocument();
  });
});
