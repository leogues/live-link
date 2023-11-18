import { describe, test, expect } from "vitest";

import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { Home } from "../Home";

describe("Home content tests", () => {
  test("Renders 'Insira o ID da reunião ou o link' input", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(
      "Insira o ID da reunião ou o link",
    );
    expect(input).toBeInTheDocument();
  });

  test("Renders 'Crie sua reunião' button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const loginWithAnonymousButton = screen.getByRole("button", {
      name: /Crie sua reunião/i,
    });

    expect(loginWithAnonymousButton).toBeInTheDocument();
  });

  test("Renders 'Entrar na reunião' button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const loginWithAnonymousButton = screen.getByRole("button", {
      name: /Entrar na reunião/i,
    });

    expect(loginWithAnonymousButton).toBeInTheDocument();
  });
});
