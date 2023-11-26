import { describe, test, expect, vitest } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import { chatCustomProviderProps } from "./ChatProviderMock";
import { MemoryRouter } from "react-router-dom";
import { Room } from "../Room";

describe("room footer chat tests", () => {
  test("send message button call the function", () => {
    const sendMessage = vitest.fn();

    render(
      <MemoryRouter>
        {chatCustomProviderProps({
          children: <Room />,
          providerProps: { sendMessage },
        })}
      </MemoryRouter>,
    );

    const sendMessageButton = screen.getByTestId("send-message");

    const chatTextArea = screen.getByPlaceholderText("Digite uma mensagem...");

    fireEvent.change(chatTextArea, { target: { value: "testid" } });

    fireEvent.click(sendMessageButton);

    expect(sendMessage).toBeCalled();
  });
});
