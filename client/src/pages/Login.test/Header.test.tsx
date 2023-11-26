import { describe, test, expect, vitest } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { Login } from "../Login";
import { ThemeContext } from "../../context/ThemeContext";

describe("Login header tests", () => {
  test("thema button toggle thema", () => {
    const switchTheme = vitest.fn();

    render(
      <ThemeContext.Provider value={{ theme: "light", switchTheme }}>
        <Login />
      </ThemeContext.Provider>,
    );

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
