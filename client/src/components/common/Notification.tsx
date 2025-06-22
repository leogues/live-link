import * as ToastPrimitive from '@radix-ui/react-toast';

import { cn } from '../../utils/cn';

import type { FC } from 'react';
type NotificationProps = {
  open?: boolean;
  duration?: number;
  onChange?: (value: boolean) => void;
  children?: React.ReactNode;
  textColor?: 'default' | 'error';
  className?: string;
};

export const Notification: FC<NotificationProps> = ({
  open,
  duration = 5000,
  onChange,
  children,
  textColor = 'default',
  className,
}: NotificationProps) => (
  <ToastPrimitive.Root
    open={open}
    duration={duration}
    onOpenChange={onChange}
    className={cn(
      'm-6 rounded border border-neutral-200 bg-white  shadow-lg dark:border-neutral-800 dark:bg-darkBlue-600',
      className
    )}
  >
    <div
      className={cn('px-4 py-3', {
        'rounded border-l-2 border-red-500': textColor === 'error',
      })}
    >
      <ToastPrimitive.Title
        className={cn('font-medium', {
          'text-darkBlue-650 dark:text-blue-100': textColor === 'default',
          'text-red-600 dark:text-red-500': textColor === 'error',
        })}
      >
        {children}
      </ToastPrimitive.Title>
    </div>
  </ToastPrimitive.Root>
);
