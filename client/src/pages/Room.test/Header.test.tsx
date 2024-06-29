import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vitest } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { Room } from "../Room";

describe("Room header tests", () => {
  test("renders creation date correctly", () => {
    render(
      <MemoryRouter>
        <Room />
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
        <Room />
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
      <MemoryRouter>
        <Room />,
      </MemoryRouter>,
    );

    const themaButton = screen.getByTestId("switcher");

    fireEvent.click(themaButton);

    expect(switchTheme).toBeCalled();
  });
});
