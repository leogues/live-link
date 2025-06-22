import { useDarkMode } from '../hooks/useDarkMode';
import { SwitcherDarkIcon, SwitcherLightIcon } from '../icons/Switcher';
import { Button } from './common/Button';

export const Switcher: React.FC = () => {
  const { switchTheme, darkSide } = useDarkMode();

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
