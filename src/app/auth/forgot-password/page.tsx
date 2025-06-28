import { ForgotPasswordForm } from "@/components/forgot-password-form";

const LoginPage = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: `calc(100vh - 86px)` }}
    >
      <div className="w-72 sm:w-96 md:w-[400px]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default LoginPage;
