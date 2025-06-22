import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vitest } from 'vitest';

import { fireEvent, render, screen } from '@testing-library/react';

import { ChatStoreProvider } from '../../context/ChatStoreContext';
import { Room } from '../Room';

describe('room footer chat tests', () => {
  test('send message button call the function', () => {
    const sendMessage = vitest.fn();

    render(
      <MemoryRouter>
        <ChatStoreProvider initialIsChatOpen>
          <Room />,
        </ChatStoreProvider>
      </MemoryRouter>
    );

    const sendMessageButton = screen.getByTestId('send-message');

    const chatTextArea = screen.getByPlaceholderText('Digite uma mensagem...');

    fireEvent.change(chatTextArea, { target: { value: 'testid' } });

    fireEvent.click(sendMessageButton);

    expect(sendMessage).toBeCalled();
  });
});
