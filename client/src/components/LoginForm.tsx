import { AnonymousIcon } from '../icons/social/Anonymous';
import apiUrl from '../services/apiUrl';
import { Button } from './common/Button';
import { FormHeader } from './FormHeader';
import { GoogleButton } from './GoogleButton';

export const LoginForm: React.FC = () => {
  const loginGoogleHandle = async () => {
    window.location.href = apiUrl + '/auth/google';
  };

  const loginLocalHandle = async () => {
    window.location.href = apiUrl + '/auth/local';
  };

  return (
    <>
      <FormHeader title="Login" />
      <div className="mt-10 flex flex-col gap-2 text-sm sm:text-base">
        <GoogleButton onClick={loginGoogleHandle} />
        <Button
          onClick={loginLocalHandle}
          className="flex items-center gap-1 border border-gray-400 px-6 py-3 font-bold hover:bg-neutral-200 dark:border-darkBlue-600 dark:hover:bg-darkBlue-600 sm:gap-3"
        >
          <AnonymousIcon width={22} height={22} />
          <span>Continue como anônimo</span>
        </Button>
      </div>
    </>
  );
};
