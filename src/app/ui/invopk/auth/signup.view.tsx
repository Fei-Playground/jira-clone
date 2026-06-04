import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useInvoPkAuth } from "@app/store/invopk-auth.store";
import { toast } from "react-toastify";
import type { Currency } from "@domain/invopk";

export const SignupView = (): JSX.Element => {
  const navigate = useNavigate();
  const { signUp } = useInvoPkAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [currency, setCurrency] = useState<Currency>("PKR");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, {
        name,
        businessName: businessName || undefined,
        defaultCurrency: currency,
      });
      toast.success("Account created successfully!");
      navigate("/invopk/dashboard");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create account");
      } else {
        toast.error("Failed to create account");
      }
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
              Create your free account to get started
            </p>
          </div>

          {/* Signup Card */}
          <div className="rounded-[24px] bg-white p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <h2 className="mb-6 text-2xl font-bold text-[#151c27]">
              Get Started
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                  placeholder="Ahmad Khan"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                  Business Name (Optional)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                  placeholder="Ahmad Designs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                  Default Currency
                </label>
                <div className="flex w-fit rounded-lg bg-[#e7eefe] p-1">
                  <button
                    type="button"
                    onClick={() => setCurrency("PKR")}
                    className={`rounded-md px-6 py-2 font-bold transition-all ${
                      currency === "PKR"
                        ? "bg-white text-[#00236f] shadow-sm"
                        : "text-[#606365] hover:text-[#151c27]"
                    }`}
                  >
                    PKR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`rounded-md px-6 py-2 font-bold transition-all ${
                      currency === "USD"
                        ? "bg-white text-[#00236f] shadow-sm"
                        : "text-[#606365] hover:text-[#151c27]"
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>

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
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Sign in link */}
            <div className="mt-6 text-center text-sm text-[#444651]">
              Already have an account?{" "}
              <Link
                to="/invopk/login"
                className="font-semibold text-[#00236f] hover:underline"
              >
                Sign in
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
