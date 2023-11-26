import { GoogleButton } from "./GoogleButton";
import { Button } from "./common/Button";
import apiUrl from "../services/apiUrl";
import TristeIcon from "../assets/triste.png";
import { FormHeader } from "./FormHeader";

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
      <div className="w-full max-w-sm rounded-md bg-gray-50 px-12 py-10 shadow-md dark:bg-darkBlue-900">
        <FormHeader title="Login" />
        <div className="mt-10 flex flex-col gap-2 ">
          <GoogleButton onClick={loginGoogleHandle} />
          <Button
            onClick={loginLocalHandle}
            className="flex items-center gap-3 border border-gray-400 px-6 py-3 font-bold hover:bg-neutral-200 dark:border-darkBlue-600 dark:hover:bg-darkBlue-600"
          >
            <img className="dark:invert-[0.85]" src={TristeIcon} />
            <span>Continue como anônimo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
