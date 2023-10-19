import clsx from "clsx";

interface ButtonProps {
  fontWeight?: "normal" | "bold";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "submit" | "button" | "reset" | undefined;
  event?: Event;
}

export const Button: React.FC<ButtonProps> = ({
  fontWeight = "font-normal",
  children,
  onClick,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "rounded-3xl",
        {
          "font-normal": fontWeight === "normal",
          "font-bold": fontWeight === "bold",
        },
        className,
      )}
    >
      {children}
    </button>
  );
};
