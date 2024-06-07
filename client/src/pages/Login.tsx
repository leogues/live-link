import { Header } from "../components/Header";
import { LoginForm } from "../components/LoginForm";

export const Login = () => {
  return (
    <div className="mx-auto my-0 flex h-screen flex-col">
      <Header />
      <LoginForm />
    </div>
  );
};
