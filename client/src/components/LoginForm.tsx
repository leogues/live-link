import TristeIcon from "../assets/triste.png";
import apiUrl from "../services/apiUrl";
import { Button } from "./common/Button";
import { FormHeader } from "./FormHeader";
import { GoogleButton } from "./GoogleButton";

export const LoginForm: React.FC = () => {
  const loginGoogleHandle = async () => {
    window.location.href = apiUrl + "/auth/google";
  };

  const loginLocalHandle = async () => {
    window.location.href = apiUrl + "/auth/local";
  };

  return (
    <div
      data-testid="login-content"
      className="font-family flex flex-grow items-center justify-center text-gray-850 dark:text-gray-300"
    >
      <div className="w-[95%] max-w-xs rounded-md bg-gray-50 p-4 shadow-md dark:bg-darkBlue-900 sm:w-full sm:max-w-sm sm:px-12 sm:py-10">
        <FormHeader title="Login" />
        <div className="mt-10 flex flex-col gap-2 ">
          <GoogleButton onClick={loginGoogleHandle} />
          <Button
            onClick={loginLocalHandle}
            className="flex items-center gap-1 border border-gray-400 px-6 py-3 font-bold hover:bg-neutral-200 dark:border-darkBlue-600 dark:hover:bg-darkBlue-600 sm:gap-3"
          >
            <img className="dark:invert-[0.85]" src={TristeIcon} />
            <span>Continue como anônimo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
