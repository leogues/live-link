import { tv, VariantProps } from "tailwind-variants";

const participantCard = tv({
  base: "text flex gap-1 rounded-full bg-[rgba(125,125,125,0.30)]  text-base",
  variants: {
    padding: {
      default: "px-6 py-1 ",
      rounded: "p-3",
    },
    size: {
      md: "text-sm leading-8",
      sm: "text-xs leading-5",
    },
  },
  defaultVariants: {
    type: "default",
    size: "md",
    padding: "default",
  },
});

export type ParticipantCardProps = VariantProps<typeof participantCard> & {
  children: React.ReactNode;
  className?: string;
};

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  size,
  padding,
  className,
  children,
}) => {
  return (
    <div className={participantCard({ size, padding, className })}>
      {children}
    </div>
  );
};
