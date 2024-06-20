import clsx from "clsx";
import { ReactNode } from "react";

import { MinizarIcon } from "../../icons/Minimizar";
import { Button } from "../common/Button";

export const SiderbarHeader: React.FC<{
  children?: ReactNode;
  name: String;
  className?: String;
  handleMinimizar: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonTestId?: string;
}> = ({ children, name, className, handleMinimizar, buttonTestId }) => {
  return (
    <header
      className={clsx(
        "flex h-14 items-center justify-between bg-white px-6 py-2 text-gray-900 dark:bg-darkBlue-900 dark:text-white",
        className,
      )}
    >
      <span>{name}</span>
      <div className="flex gap-2">
        {children}
        <Button testid={buttonTestId} className="p-1" onClick={handleMinimizar}>
          <MinizarIcon className="rotate-180 group-aria-[expanded=true]:rotate-0" />
        </Button>
      </div>
    </header>
  );
};
