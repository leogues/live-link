import { ReactNode } from "react";
import { Button } from "../common/Button";
import minimizarIcon from "../../assets/setaCima.svg";
import clsx from "clsx";

export const SiderbarHeader: React.FC<{
  children?: ReactNode;
  name: String;
  className?: String;
  handleMinimizar: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ children, name, className, handleMinimizar }) => {
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
        <Button className="p-1" onClick={handleMinimizar}>
          <img
            className="rotate-180 group-aria-[expanded=true]:rotate-0"
            src={minimizarIcon}
          />
        </Button>
      </div>
    </header>
  );
};
