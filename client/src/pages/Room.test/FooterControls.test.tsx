import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vitest } from 'vitest';

import { fireEvent, render, screen } from '@testing-library/react';

import { ChatStoreProvider } from '../../context/ChatStoreContext';
import { Room } from '../Room';
import { streamCustomProviderProps } from './StreamProviderMock';

describe('Room footer controls tests', () => {
  test('microphone button calls the function', () => {
    const handleMicOn = vitest.fn();

    render(
      <MemoryRouter>
        {streamCustomProviderProps({
          children: <Room />,
          providerProps: { handleMicOn },
        })}
      </MemoryRouter>
    );

    const micToggleButton = screen.getByTestId('mic-toggle');

    fireEvent(
      micToggleButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(handleMicOn).toBeCalled();
  });

  test('webcam button calls the function', () => {
    const handleWebCamOn = vitest.fn();

    render(
      <MemoryRouter>
        {streamCustomProviderProps({
          children: <Room />,
          providerProps: { handleWebCamOn },
        })}
      </MemoryRouter>
    );

    const webCamToggleButton = screen.getByTestId('web-cam-toggle');

    fireEvent(
      webCamToggleButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(handleWebCamOn).toBeCalled();
  });

  test('sharingscreen button calls the function', () => {
    const handleScreenOn = vitest.fn();

    render(
      <MemoryRouter>
        {streamCustomProviderProps({
          children: <Room />,
          providerProps: { handleScreenOn },
        })}
      </MemoryRouter>
    );

    const webCamToggleButton = screen.getByTestId('sharingscreen-toggle');

    fireEvent(
      webCamToggleButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(handleScreenOn).toBeCalled();
  });

  test('sharingscreen button calls the function', () => {
    const handleScreenOn = vitest.fn();

    render(
      <MemoryRouter>
        {streamCustomProviderProps({
          children: <Room />,
          providerProps: { handleScreenOn },
        })}
      </MemoryRouter>
    );

    const sharingscreenToggleButton = screen.getByTestId(
      'sharingscreen-toggle'
    );

    fireEvent(
      sharingscreenToggleButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(handleScreenOn).toBeCalled();
  });

  test('chat button toggles chat', () => {
    render(
      <MemoryRouter>
        <ChatStoreProvider initialIsChatOpen>
          <Room />
        </ChatStoreProvider>
      </MemoryRouter>
    );

    const chatToggleButton = screen.getByTestId('chat-toggle');

    fireEvent.click(chatToggleButton);

    let textarea = screen.queryByRole('textbox');
    expect(textarea).not.toBeInTheDocument();

    fireEvent.click(chatToggleButton);

    textarea = screen.queryByRole('textbox');

    expect(textarea).toBeInTheDocument();
  });

  test("renders 'Sair da reunião' button", () => {
    render(
      <MemoryRouter>
        <Room />
      </MemoryRouter>
    );

    const leaveRoomButton = screen.getByRole('link', {
      name: 'Sair da reunião',
    });

    expect(leaveRoomButton).toBeInTheDocument();
  });
});
