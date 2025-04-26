import { tv, VariantProps } from 'tailwind-variants';

const label = tv({
  base: 'text flex gap-1 rounded-full bg-[rgba(0,0,0,0.30)]  text-base',
  variants: {
    padding: {
      default: 'px-6 py-1 ',
      rounded: 'p-3',
    },
    size: {
      md: 'text-sm leading-8',
      sm: 'text-xs leading-5',
    },
  },
  defaultVariants: {
    type: 'default',
    size: 'md',
    padding: 'default',
  },
});

export type ParticipantCardProps = VariantProps<typeof label> & {
  children: React.ReactNode;
  className?: string;
};

export const Label: React.FC<ParticipantCardProps> = ({
  size,
  padding,
  className,
  children,
}) => {
  return <div className={label({ size, padding, className })}>{children}</div>;
};
