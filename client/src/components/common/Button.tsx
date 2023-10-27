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
  onClick?: () => void;
  className?: string;
  type?: "submit" | "button" | "reset" | undefined;
  event?: Event;
} & VariantProps<typeof button>;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  fontWeight,
  rounded,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={button({ fontWeight, rounded, className })}
    >
      {children}
    </button>
  );
};
