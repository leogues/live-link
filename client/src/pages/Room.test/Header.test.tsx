import { describe, test, expect, vitest } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { ThemeContext } from "../../context/ThemeContext";
import { Room } from "../Room";
import { IRoom } from "../../context/RoomV2Context";
import { MemoryRouter } from "react-router-dom";
import { roomCustomProviderProps } from "./RoomProviderMock";

describe("Room header tests", () => {
  test("renders creation date correctly", () => {
    const room: IRoom = {
      id: "1",
      createdAt: "2023-10-17T19:38:40.955Z",
      topic: "",
      userId: "",
    };

    render(
      <MemoryRouter>
        {roomCustomProviderProps({
          children: <Room />,
          providerProps: { room },
        })}
      </MemoryRouter>,
    );

    const createdAtFormatedText = screen.getByText(
      "17 de outubro de 2023 | 4:38 PM",
    );

    expect(createdAtFormatedText).toBeInTheDocument();
  });

  test("should render a maximum of four participant avatars plus 1 indicating the remaining number of participants", () => {
    render(
      <MemoryRouter>
        {roomCustomProviderProps({
          children: <Room />,
          providerProps: {},
        })}
      </MemoryRouter>,
    );

    const participantsAvatars = screen.getByTestId("participants-avatars");

    const participantsAvatarsChildrensCount =
      participantsAvatars.childElementCount;

    expect(participantsAvatarsChildrensCount).toEqual(5);

    const lastChildrenParticipantsAvatars =
      participantsAvatars.lastChild as ChildNode;

    expect(lastChildrenParticipantsAvatars.textContent).toEqual("+1");
  });

  test("thema button toggle thema", () => {
    const switchTheme = vitest.fn();

    render(
      <ThemeContext.Provider value={{ theme: "light", switchTheme }}>
        <MemoryRouter>
          {roomCustomProviderProps({
            children: <Room />,
            providerProps: {},
          })}
        </MemoryRouter>
      </ThemeContext.Provider>,
    );

    const themaButton = screen.getByTestId("switcher");

    fireEvent.click(themaButton);

    expect(switchTheme).toBeCalled();
  });
});
