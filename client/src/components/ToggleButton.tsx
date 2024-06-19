import { tv, VariantProps } from "tailwind-variants";

import { Button } from "./common/Button";

const toggleButton = tv({
  base: "p-3 hover:brightness-90",
  variants: {
    enabled: {
      true: "bg-blue-800  dark:bg-blue-700 ",
      false: "bg-blue-50  dark:bg-darkBlue-400 ",
    },
  },
  defaultVariants: {
    enabled: false,
  },
});

type ToggleButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  testid?: string;
  children: React.ReactNode;
  className?: string;
  event?: Event;
} & VariantProps<typeof toggleButton>;

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  onClick,
  testid,
  children,
  enabled,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      testid={testid}
      rounded="roundendFull"
      className={toggleButton({ enabled, className })}
    >
      {children}
    </Button>
  );
};
