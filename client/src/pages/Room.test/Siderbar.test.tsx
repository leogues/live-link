import { describe, test, expect } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import { Room } from "../Room";
import { MemoryRouter } from "react-router-dom";
import { ChatProvider } from "../../context/ChatContext";
import { roomCustomProviderProps } from "./RoomProviderMock";
import { chatCustomProviderProps } from "./ChatProviderMock";
import { userCustomProviderProps } from "./UserProviderMock";
import { ChatState } from "../../reducers/chatReduces";

const chatMock: ChatState = {
  isChatOpen: true,
  messages: [
    {
      content: "lorem",
      name: "nametestid",
      picture: "",
      timestamp: 0,
      userId: "testid",
    },
    {
      content: "lorem2",
      name: "nametest2",
      picture: "",
      timestamp: 0,
      userId: "test2",
    },
  ],
};

describe("room siderbar tests", () => {
  test("renders participant for every peer", () => {
    render(
      <MemoryRouter>
        <ChatProvider>
          {roomCustomProviderProps({
            children: <Room />,
          })}
        </ChatProvider>
      </MemoryRouter>,
    );

    const participants = screen.getAllByTestId("participant");
    expect(participants).toHaveLength(5);
  });

  test("checks the correct rendering of chat messages for the current user and other users", () => {
    const user = { id: "testid", name: "nametestid" };
    const otherUser = { id: "test2", name: "nametest2" };

    render(
      <MemoryRouter>
        {userCustomProviderProps({
          children: chatCustomProviderProps({
            children: <Room />,
            providerProps: { chat: chatMock },
          }),
          providerProps: { user },
        })}
      </MemoryRouter>,
    );

    const messageElements = screen.getAllByTestId("message");

    const firstMessage = messageElements[0];

    expect(firstMessage).not.toHaveTextContent(user.name);
    expect(firstMessage).toHaveTextContent("Você");

    const otherMessage = messageElements[1];

    expect(otherMessage).not.toHaveTextContent("Você");
    expect(otherMessage).toHaveTextContent(otherUser.name);
  });

  test("ensures no image or name is displayed in the consecutive message if it's from the same author", () => {
    const chat = { ...chatMock };

    const firstMessage = {
      content: "lorem",
      name: "nametestid",
      picture: "",
      timestamp: 0,
      userId: "testid",
    };

    const secondMessage = {
      content: "lorem2",
      name: "nametestid",
      picture: "",
      timestamp: 0,
      userId: "testid",
    };

    chat.messages = [firstMessage, secondMessage];

    render(
      <MemoryRouter>
        {chatCustomProviderProps({
          children: <Room />,
          providerProps: { chat },
        })}
      </MemoryRouter>,
    );

    const messageElements = screen.getAllByTestId("message");

    const firstMessageElement = messageElements[0];

    const firstMessageUserPicture = firstMessageElement.querySelector("img");

    expect(firstMessageElement).toHaveTextContent(firstMessage.name);
    expect(firstMessageUserPicture).toBeInTheDocument();

    const secondMessageElement = messageElements[1];

    const secondMessageUserPicture = secondMessageElement.querySelector("img");

    expect(secondMessageElement).not.toHaveTextContent(secondMessage.name);
    expect(secondMessageUserPicture).toBeNull();
  });

  test("participants expand button toggle aria-expand state", () => {
    render(
      <MemoryRouter>
        <ChatProvider>
          <Room />
        </ChatProvider>
      </MemoryRouter>,
    );

    const participants = screen.getByTestId("participants");
    const participantsExpandToggleButton = screen.getByTestId(
      "participant-expand-toggle",
    );

    const expandStateBeforeClick = participants.getAttribute("aria-expanded");

    fireEvent.click(participantsExpandToggleButton);

    const expandStateAfterClick = participants.getAttribute("aria-expanded");

    expect(expandStateBeforeClick).not.toEqual(expandStateAfterClick);
    expect(expandStateAfterClick).toEqual(
      expandStateBeforeClick === "true" ? "false" : "true",
    );
  });

  test("chat expand button toggle expand state", () => {
    render(
      <MemoryRouter>
        <ChatProvider>
          <Room />
        </ChatProvider>
      </MemoryRouter>,
    );

    const chat = screen.getByTestId("chat");
    const chatExpandToggleButton = screen.getByTestId("chat-expand-toggle");

    const expandStateBeforeClick = chat.getAttribute("aria-expanded");

    fireEvent.click(chatExpandToggleButton);

    const expandStateAfterClick = chat.getAttribute("aria-expanded");

    expect(expandStateBeforeClick).not.toEqual(expandStateAfterClick);
    expect(expandStateAfterClick).toEqual(
      expandStateBeforeClick === "true" ? "false" : "true",
    );
  });
});
