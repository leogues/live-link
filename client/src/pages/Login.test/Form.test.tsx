import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Login } from "../Login";

describe("Login form tests", () => {
  test("Renders 'Continue com o Google' button", () => {
    render(<Login />);

    const loginWithGoogleButton = screen.getByRole("button", {
      name: /Continue com o Google/i,
    });

    expect(loginWithGoogleButton).toBeInTheDocument();
  });

  test("Renders 'Continue como anônimo' button", () => {
    render(<Login />);

    const loginWithAnonymousButton = screen.getByRole("button", {
      name: /Continue como anônimo/i,
    });

    expect(loginWithAnonymousButton).toBeInTheDocument();
  });
});
