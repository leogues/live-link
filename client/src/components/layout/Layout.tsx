import React from 'react';

import { cn } from '../../utils/cn';
import { Header } from '../Header';

type LayoutProps = {
  children: React.ReactNode;
  dataTestid?: string;
  size?: 'sm' | 'md';
};

const Layout: React.FC<LayoutProps> = ({
  children,
  dataTestid,
  size = 'md',
}) => {
  return (
    <div className="mx-auto my-0 flex h-screen flex-col items-center">
      <Header />
      <div
        data-testid={dataTestid}
        className="font-family flex w-[95%] flex-grow items-center justify-center text-gray-850 dark:text-gray-300"
      >
        <div
          className={cn(
            'w-full rounded-md bg-white p-4 shadow-md dark:bg-darkBlue-900 sm:px-10 sm:py-8',
            {
              'max-w-xs sm:max-w-sm': size === 'sm',
              'max-w-md': size === 'md',
            }
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
