import { tv, VariantProps } from "tailwind-variants";

const button = tv({
  variants: {
    rounded: {
      default: "rounded-3xl",
      roundendFull: "rounded-full",
    },
    fontWeight: {
      normal: "font-normal",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    rounded: "default",
    fontWeight: "normal",
  },
});

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset" | undefined;
  event?: Event;
} & VariantProps<typeof button>;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  fontWeight,
  rounded,
  className,
  disabled,
  type = "button",
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={button({ fontWeight, rounded, className })}
    >
      {children}
    </button>
  );
};
