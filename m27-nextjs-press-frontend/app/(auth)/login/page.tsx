import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-2xl border p-9 shadow-2xl">
          {/* Text Part */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl text-center font-semibold text-blue-600">
            Welcome Back!
          </h1>
          <p className="text-lg text-slate-600 ">
            Enter your credentials to login
          </p>
        </div>

        {/* Form */}
        <div >
          <LoginForm></LoginForm>
        </div>
        </div>
      </div>
    </>
  );
}
