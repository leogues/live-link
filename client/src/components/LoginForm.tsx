import { GoogleButton } from "./GoogleButton";
import { Button } from "./common/Button";
import apiUrl from "../services/apiUrl";
import TristeIcon from "../assets/triste.svg";

export const LoginForm: React.FC = () => {
  const loginHandle = async () => {
    window.location.href = apiUrl + "/auth/google";
  };

  return (
    <div className="font-family flex flex-grow items-center justify-center text-gray-850 dark:text-gray-300">
      <div className="w-full max-w-sm rounded-md bg-gray-50 px-12 py-10 shadow-md dark:bg-darkBlue-900">
        <header className="flex justify-center border-b border-gray-300 pb-3 dark:border-darkBlue-600">
          <h3 className="text-2xl font-medium">Login</h3>
        </header>
        <div className="mt-10 flex flex-col gap-2 ">
          <GoogleButton onClick={loginHandle} />
          <Button
            onClick={() => {
              console.log("test");
            }}
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
