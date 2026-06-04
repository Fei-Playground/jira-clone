import { useState } from "react";
import { useNavigate } from "react-router";
import { TopHeader } from "../layout/top-header";
import { BottomNav } from "../layout/bottom-nav";
import { useInvoPkAuth } from "@app/store/invopk-auth.store";
import { toast } from "react-toastify";

export const SettingsView = (): JSX.Element => {
  const navigate = useNavigate();
  const { invoPkUser, logout } = useInvoPkAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/invopk");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  if (!invoPkUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <TopHeader />

      <main className="mx-auto max-w-screen-xl px-5 pb-32 pt-6">
        <h2 className="mb-6 text-2xl font-bold text-[#00236f]">Settings</h2>

        {/* Profile Section */}
        <section className="mb-6 rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <h3 className="mb-4 text-xl font-semibold text-[#151c27]">Profile</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Name
              </p>
              <p className="text-base text-[#151c27]">{invoPkUser.name}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Email
              </p>
              <p className="text-base text-[#151c27]">{invoPkUser.email}</p>
            </div>
            {invoPkUser.businessName && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
                  Business Name
                </p>
                <p className="text-base text-[#151c27]">
                  {invoPkUser.businessName}
                </p>
              </div>
            )}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Default Currency
              </p>
              <p className="text-base text-[#151c27]">
                {invoPkUser.defaultCurrency}
              </p>
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="mb-6 rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <h3 className="mb-4 text-xl font-semibold text-[#151c27]">
            Subscription
          </h3>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Current Plan
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    invoPkUser.isPro
                      ? "bg-gradient-to-r from-[#1e3a8a] to-[#00236f] text-white"
                      : "bg-[#e7eefe] text-[#606365]"
                  }`}
                >
                  {invoPkUser.isPro ? "Pro" : "Free"}
                </span>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Invoices Used
              </p>
              <p className="text-base text-[#151c27]">
                {invoPkUser.invoiceCount}{" "}
                {!invoPkUser.isPro && "/ 3 (Free Tier)"}
              </p>
            </div>

            {!invoPkUser.isPro && (
              <div className="rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#00236f] p-6 text-white">
                <h4 className="mb-2 text-lg font-bold">Upgrade to Pro</h4>
                <p className="mb-4 text-sm opacity-90">
                  Get unlimited invoices and advanced features
                </p>
                <div className="mb-4">
                  <div className="mb-1">
                    <span className="text-3xl font-bold">Rs 300</span>
                    <span className="text-sm opacity-80">/month</span>
                  </div>
                  <p className="text-xs opacity-70">
                    or Rs 2,500/year (save 30%)
                  </p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider">
                    Payment Instructions
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>PKR:</strong> JazzCash/EasyPaisa 03XX-XXXXXXX
                    </p>
                    <p>
                      <strong>USD:</strong> PayRoute link
                    </p>
                    <p className="text-xs opacity-70">
                      Email support@invopk.com after payment
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Help Section */}
        <section className="mb-6 rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <h3 className="mb-4 text-xl font-semibold text-[#151c27]">
            Help & Support
          </h3>
          <div className="space-y-3">
            <a
              href="#"
              className="flex items-center justify-between rounded-lg p-3 text-[#00236f] transition-colors hover:bg-[#f9f9ff]"
            >
              <span className="font-semibold">FAQs</span>
              <span>→</span>
            </a>
            <a
              href="mailto:support@invopk.com"
              className="flex items-center justify-between rounded-lg p-3 text-[#00236f] transition-colors hover:bg-[#f9f9ff]"
            >
              <span className="font-semibold">Contact Support</span>
              <span>→</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-between rounded-lg p-3 text-[#00236f] transition-colors hover:bg-[#f9f9ff]"
            >
              <span className="font-semibold">Terms of Service</span>
              <span>→</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-between rounded-lg p-3 text-[#00236f] transition-colors hover:bg-[#f9f9ff]"
            >
              <span className="font-semibold">Privacy Policy</span>
              <span>→</span>
            </a>
          </div>
        </section>

        {/* Logout */}
        <section>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#ba1a1a] bg-transparent font-semibold text-[#ba1a1a] transition-all hover:bg-[#ffdad6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
