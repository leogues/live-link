import { tv, VariantProps } from "tailwind-variants";

const userMicrophoneVideoToggle = tv({
  base: "rounded-full",
  variants: {
    bg: {
      default: "",
      toggle: "bg-red-600",
    },
    toggle: {
      true: "bg-blue-800",
    },
    padding: {
      sm: "p-0",
      md: "p-2",
    },
  },
  defaultVariants: {
    bg: "default",
    padding: "md",
  },
});

export type UserMicrophoneVideoToggleProps = VariantProps<
  typeof userMicrophoneVideoToggle
> & {
  children: React.ReactNode;
  className?: string;
};

export const UserMicrophoneVideoToggle: React.FC<
  UserMicrophoneVideoToggleProps
> = ({ className, bg, toggle, padding, children }) => {
  return (
    <div
      className={userMicrophoneVideoToggle({ bg, toggle, padding, className })}
    >
      {children}
    </div>
  );
};
