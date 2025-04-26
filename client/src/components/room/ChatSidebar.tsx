import { useChatActions, useChatMenuRefs } from '../../hooks/useChatStore';
import { useMultipleRefsClickOutside } from '../../hooks/useClickOutside';
import { Chat } from '../chat/Chat';
import { SiderbarHeader } from './SiderbarHeader';

export const ChatSidebar: React.FC<{
  handleMinimizar: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ handleMinimizar }) => {
  const { toggleChat } = useChatActions();
  const menuRef = useChatMenuRefs();
  useMultipleRefsClickOutside(
    [menuRef.chat, menuRef.chatInput, menuRef.inviteModal],
    () => toggleChat(),
    { breakpoint: 768 }
  );

  return (
    <div
      className="group flex flex-col aria-expanded:min-h-[60%] aria-expanded:flex-1 aria-expanded:grow"
      data-testid="chat"
      aria-expanded="true"
    >
      <SiderbarHeader
        name="Chat"
        handleMinimizar={handleMinimizar}
        buttonTestId="chat-expand-toggle"
      />
      <Chat />
    </div>
  );
};
