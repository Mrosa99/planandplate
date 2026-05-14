import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: `calc(100vh - 86px)` }}
    >
      <div className="w-72 sm:w-96 md:w-100">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
