import Layout from "../components/layout/Layout";
import { LoginForm } from "../components/LoginForm";

export const Login = () => {
  return (
    <Layout dataTestid="login-content" size="sm">
      <LoginForm />
    </Layout>
  );
};
