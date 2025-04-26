import { describe, expect, test } from 'vitest';

import { render, screen } from '@testing-library/react';

import { Login } from '../Login';

describe('Login form tests', () => {
  test("Renders 'Continue com o Google' button", () => {
    render(<Login />);

    const loginWithGoogleButton = screen.getByRole('button', {
      name: 'Continue com o Google',
    });

    expect(loginWithGoogleButton).toBeInTheDocument();
  });

  test("Renders 'Continue como anônimo' button", () => {
    render(<Login />);

    const loginWithAnonymousButton = screen.getByRole('button', {
      name: 'Continue como anônimo',
    });

    expect(loginWithAnonymousButton).toBeInTheDocument();
  });
});
