import { useState } from 'react';

import { useChatActions } from '../../hooks/useChatStore';
import { useThisRoom } from '../../hooks/useRoom';
import { useMeQuery } from '../../hooks/useUser';
import { SendIcon } from '../../icons/Send';
import { ws } from '../../services/ws';
import { Button } from '../common/Button';

export const ChatInput: React.FC = () => {
  const { data: room } = useThisRoom();

  const [message, setMessage] = useState('');
  const { addMessage } = useChatActions();
  const { data: user } = useMeQuery();

  const handleSendMessage = () => {
    if (!room || !user) return;

    if (message === '') return;

    const messageData = {
      roomId: room.id,
      content: message,
      userId: user.id,
      name: user.name,
      lastName: user.lastName,
      picture: user.picture,
      timestamp: new Date().getTime(),
    };

    addMessage(messageData);
    ws.emit('send-message', room.id, messageData);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full py-1 pl-4 pr-5">
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="flex h-14 max-w-full items-center justify-center rounded-full bg-gray-100 dark:bg-darkBlue-700 ">
          <textarea
            placeholder="Digite aqui..."
            className="flex h-4/5 grow resize-none overflow-hidden border-0 bg-transparent px-3 py-[0.6rem] align-middle text-gray-900 outline-none placeholder:text-gray-700 dark:text-white"
            onChange={e => setMessage(e.target.value)}
            value={message}
            onKeyDown={handleKeyDown}
          />
          <Button
            testid="send-message"
            type="submit"
            className="focus: mr-1 rounded-full bg-blue-700 p-2 hover:brightness-90"
          >
            <SendIcon width={30} height={30} />
          </Button>
        </div>
      </form>
    </div>
  );
};
