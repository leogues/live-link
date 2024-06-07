import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vitest } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { ThemeContext } from "../../context/ThemeContext";
import { Home } from "../Home";

describe("Home header tests", () => {
  test("thema button toggle thema", () => {
    const switchTheme = vitest.fn();

    render(
      <ThemeContext.Provider value={{ theme: "light", switchTheme }}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ThemeContext.Provider>,
    );

    const themaButton = screen.getByTestId("switcher");

    fireEvent.click(themaButton);

    expect(switchTheme).toHaveBeenCalled();
  });

  test("renders github link", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const githubLink = screen.getByTestId("github");

    expect(githubLink).toBeInTheDocument();
  });
});
