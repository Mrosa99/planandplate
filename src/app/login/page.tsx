import { LoginForm } from "@/components/login-form";

export default function Login() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: `calc(100vh - 86px)` }}
    >
      <div className="w-72 sm:w-96 md:w-[400px]">
        <LoginForm />
      </div>
    </div>
  );
}
