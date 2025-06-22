import React from 'react';
import { Link } from 'react-router-dom';

import { useChatIsOpen, useChatMenuRefs } from '../../hooks/useChatStore';
import { LeaveIcon } from '../../icons/Leave';
import { ChatInput } from '../chat/ChatInput';
import { RoomControlButtons } from './RoomControlButtons';

export const RoomFooter: React.FC = () => {
  const isChatOpen = useChatIsOpen();
  const { chatInput } = useChatMenuRefs();
  return (
    <footer className="relative flex flex-shrink-0 grow basis-auto  bg-white dark:bg-darkBlue-900">
      <div className="relative flex h-full grow items-center  justify-between border border-[#EDF0F6] px-2 dark:border-[#1F2335] sm:px-4 lg:justify-center">
        <RoomControlButtons />

        <Link
          to=".."
          className="h-max rounded-full bg-red-600 p-3.5 hover:brightness-90 dark:bg-red-800 md:px-7 md:py-3 lg:absolute lg:right-8 lg:top-1/2 lg:-translate-y-1/2"
        >
          <LeaveIcon
            width={20}
            height={20}
            className="block brightness-200 invert-0 lg:hidden"
          />
          <span className="hidden lg:block ">Sair da reunião</span>
        </Link>
      </div>

      {isChatOpen && (
        <div
          ref={chatInput}
          className="absolute right-0 z-40 flex h-full w-[20rem] shrink-0 items-center justify-center border border-[#EDF0F6] bg-white dark:border-[#1F2335] dark:bg-darkBlue-900 sm:w-[24rem] md:static"
        >
          <ChatInput />
        </div>
      )}
    </footer>
  );
};
