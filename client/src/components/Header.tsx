import { GitHubIcon } from "../icons/social/Github";
import { Switcher } from "./Switcher";

export const Header: React.FC<{}> = ({}) => {
  return (
    <div className="flex w-full items-center justify-end gap-4 p-4">
      <Switcher />
      <a
        data-testid="github"
        href="https://github.com/leogues/"
        target="_blank"
      >
        <GitHubIcon
          className="invert-[0.6] hover:invert-[0.3] dark:hover:invert-[0.8]"
          width={24}
          height={24}
        />
      </a>
    </div>
  );
};
