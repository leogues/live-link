import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";
import { SwitcherDarkIcon, SwitcherLightIcon } from "../icons/Switcher";
import { Button } from "./common/Button";

export const Switcher: React.FC = () => {
  const { theme, switchTheme } = useContext(ThemeContext);
  const darkSide = theme === "dark" ? true : false;

  return (
    <Button testid="switcher" className="" onClick={switchTheme}>
      {darkSide ? (
        <SwitcherDarkIcon
          width={28}
          height={28}
          className="hover:brightness-110"
        />
      ) : (
        <SwitcherLightIcon
          width={28}
          height={28}
          className="hover:brightness-90"
        />
      )}
    </Button>
  );
};
