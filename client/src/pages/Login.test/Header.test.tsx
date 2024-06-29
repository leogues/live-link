import { describe, expect, test, vitest } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { Login } from "../Login";

describe("Login header tests", () => {
  test("thema button toggle thema", () => {
    const switchTheme = vitest.fn();

    render(<Login />);

    const themaButton = screen.getByTestId("switcher");

    fireEvent.click(themaButton);

    expect(switchTheme).toBeCalled();
  });

  test("renders github link", () => {
    render(<Login />);

    const githubLink = screen.getByTestId("github");

    expect(githubLink).toBeInTheDocument();
  });
});
