import { Switcher } from "./Switcher";
import GithubIcon from "../assets/github.png";

export const Header: React.FC<{}> = ({}) => {
  return (
    <div className="flex items-center justify-end gap-4 p-4">
      <Switcher />
      <a
        data-testid="github"
        href="https://github.com/leogues/"
        target="_blank"
      >
        <img
          className="block h-[1.4rem] max-w-full invert-[0.6] hover:invert-[0.3] dark:hover:invert-[0.8]"
          src={GithubIcon}
        />
      </a>
    </div>
  );
};
