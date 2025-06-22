import { FC } from 'react';

import ChatIcon from '../assets/chat.png';
import { Button } from './common/Button';

export const ChatButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button className="p-4 text-white" onClick={onClick}>
      <img src={ChatIcon} />
    </Button>
  );
};
