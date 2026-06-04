import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useInvoPkAuth } from "@app/store/invopk-auth.store";
import { toast } from "react-toastify";

export const LoginView = (): JSX.Element => {
  const navigate = useNavigate();
  const { signIn } = useInvoPkAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      navigate("/invopk/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-[#00236f]">InvoPk</h1>
            <p className="text-sm text-[#444651]">
              Simple invoicing for Pakistani freelancers
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-[24px] bg-white p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <h2 className="mb-6 text-2xl font-bold text-[#151c27]">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#c5c5d3]"></div>
              <span className="text-xs text-[#606365]">OR</span>
              <div className="h-px flex-1 bg-[#c5c5d3]"></div>
            </div>

            {/* Google Sign-in */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#c5c5d3] bg-white font-semibold text-[#151c27] transition-all hover:bg-[#f9f9ff] active:scale-[0.98]"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Sign up link */}
            <div className="mt-6 text-center text-sm text-[#444651]">
              Don't have an account?{" "}
              <Link
                to="/invopk/signup"
                className="font-semibold text-[#00236f] hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link
              to="/invopk"
              className="text-sm text-[#444651] hover:text-[#00236f]"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
