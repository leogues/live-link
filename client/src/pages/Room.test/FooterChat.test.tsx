import { describe, test, expect, vitest } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import { chatCustomProviderProps } from "./ChatMock";
import { MemoryRouter } from "react-router-dom";
import { Room } from "../Room";

describe("Room footer chat tests", () => {
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

    fireEvent.click(sendMessageButton);

    expect(sendMessage).toBeCalled();
  });
});
