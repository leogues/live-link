import { Button } from '../common/Button';

type MeetingHeaderProps = {
  leftButtonHandle?: () => void;
  leftButtonText: string;
  rightButtonHandle?: () => void;
  rightButtonText: string;
};

export const MeetingButtons: React.FC<MeetingHeaderProps> = ({
  leftButtonHandle,
  leftButtonText,
  rightButtonHandle,
  rightButtonText,
}) => {
  return (
    <div className="mt-3 flex items-center gap-2 text-sm font-semibold md:mt-8">
      <div className="flex flex-1 flex-col gap-2">
        <Button
          onClick={leftButtonHandle}
          className="bg-blue-50 py-3 text-blue-800 hover:brightness-95 dark:bg-darkBlue-400 dark:text-blue-700 dark:hover:brightness-110"
        >
          {leftButtonText}
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Button
          className="bg-blue-800 py-3 text-white hover:brightness-110  dark:hover:brightness-90"
          onClick={rightButtonHandle}
        >
          {rightButtonText}
        </Button>
      </div>
    </div>
  );
};
