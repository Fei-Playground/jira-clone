import { Link } from "react-router";

export const LandingView = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 w-full bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
        <nav className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold leading-8 tracking-tight text-[#00236f]">
              InvoPk
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-xs font-semibold uppercase leading-4 tracking-wider text-[#444749] transition-colors hover:text-[#00236f]"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-xs font-semibold uppercase leading-4 tracking-wider text-[#444749] transition-colors hover:text-[#00236f]"
            >
              Pricing
            </a>
            <Link
              to="/invopk/login"
              className="rounded-xl bg-[#00236f] px-6 py-2 text-xs font-semibold uppercase leading-4 tracking-wider text-white transition-opacity hover:opacity-90 active:scale-95"
            >
              Login
            </Link>
          </div>
          <div className="md:hidden">
            <span className="text-[#00236f]">☰</span>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pb-24 pt-12">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2">
            <div className="z-10 text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1e3a8a]/10 px-4 py-2 text-[#00236f]">
                <span className="text-[18px]">✓</span>
                <span className="text-xs font-semibold uppercase leading-4 tracking-wider">
                  Trusted by 5,000+ Pakistani Freelancers
                </span>
              </div>
              <h1 className="mb-6 text-[40px] font-bold leading-tight text-[#151c27] md:text-[32px] md:leading-[1.1]">
                Simple Invoicing for{" "}
                <span className="text-[#00236f]">Pakistani Freelancers</span>
              </h1>
              <p className="mx-auto mb-10 max-w-lg text-base leading-6 text-[#444651] lg:mx-0">
                Create professional invoices in PKR or USD, track unpaid
                invoices, and get paid faster. No business verification needed.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                <Link
                  to="/invopk/signup"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] px-8 font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98] sm:w-auto"
                >
                  Get Started Free
                </Link>
                <a
                  href="#demo"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#00236f] bg-transparent px-8 font-semibold text-[#00236f] transition-all hover:bg-[#00236f]/5 active:scale-[0.98] sm:w-auto"
                >
                  View Demo
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="shadow-2xl aspect-square w-full rounded-[24px] bg-gradient-to-br from-[#1e3a8a] to-[#00236f]"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-24">
          <div className="mx-auto max-w-screen-xl px-5">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-[32px] font-bold leading-10 text-[#151c27]">
                Everything You Need to Get Paid
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-6 text-[#444651]">
                Professional invoicing tools designed specifically for Pakistani
                freelancers working with international clients.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "⚡",
                  title: "Create in 30 Seconds",
                  desc: "Generate professional invoices with line items, taxes, and discounts in less than a minute.",
                },
                {
                  icon: "💵",
                  title: "PKR and USD Support",
                  desc: "Invoice in Pakistani Rupees or US Dollars. Perfect for local and international clients.",
                },
                {
                  icon: "🔗",
                  title: "Payment Link Ready",
                  desc: "Add your PayRoute or Stripe link so clients can pay instantly online.",
                },
                {
                  icon: "⏰",
                  title: "Overdue Tracking",
                  desc: "Automatically tracks due dates and marks invoices as overdue to help you follow up.",
                },
                {
                  icon: "📱",
                  title: "Mobile-First Design",
                  desc: "Create and manage invoices on the go from your phone or tablet.",
                },
                {
                  icon: "✅",
                  title: "No Verification Required",
                  desc: "Start invoicing immediately. No business registration or Meta verification needed.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-[24px] bg-[#f9f9ff] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]"
                >
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold leading-7 text-[#00236f]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-5 text-[#444651]">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-screen-xl px-5">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-[32px] font-bold leading-10 text-[#151c27]">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-6 text-[#444651]">
                Start free, upgrade when you're ready. No hidden fees.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              {/* Free Plan */}
              <div className="rounded-[24px] bg-white p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <h3 className="mb-2 text-2xl font-bold text-[#00236f]">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#151c27]">
                    Rs 0
                  </span>
                  <span className="text-[#444651]">/forever</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {[
                    "Up to 3 invoices total",
                    "Client management",
                    "PKR and USD support",
                    "Payment link field",
                    "Mobile-friendly",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#10B981]">✓</span>
                      <span className="text-sm text-[#444651]">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/invopk/signup"
                  className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-[#00236f] bg-transparent font-semibold text-[#00236f] transition-all hover:bg-[#00236f]/5 active:scale-95"
                >
                  Get Started
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e3a8a] to-[#00236f] p-8 text-white shadow-[0px_10px_30px_rgba(0,0,0,0.15)]">
                <div className="absolute right-4 top-4 rounded-full bg-[#10B981] px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Popular
                </div>
                <h3 className="mb-2 text-2xl font-bold">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Rs 300</span>
                  <span className="opacity-80">/month</span>
                  <div className="mt-1 text-sm opacity-70">
                    or Rs 2,500/year (save 30%)
                  </div>
                </div>
                <ul className="mb-8 space-y-3">
                  {[
                    "Unlimited invoices",
                    "All Free features",
                    "Recurring invoices",
                    "Advanced filters",
                    "Priority support",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#10B981]">✓</span>
                      <span className="text-sm opacity-90">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="hover:bg-gray-100 flex h-12 w-full items-center justify-center rounded-xl bg-white font-semibold text-[#00236f] transition-all active:scale-95">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#00236f] py-24 text-white">
          <div className="mx-auto max-w-screen-xl px-5 text-center">
            <h2 className="mb-4 text-[32px] font-bold leading-10">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-6 opacity-90">
              Join thousands of Pakistani freelancers who trust InvoPk for their
              invoicing needs.
            </p>
            <Link
              to="/invopk/signup"
              className="hover:bg-gray-100 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-8 font-semibold text-[#00236f] shadow-lg transition-all active:scale-[0.98]"
            >
              Create Your First Invoice
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#151c27] py-12 text-white">
        <div className="mx-auto max-w-screen-xl px-5">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-xl font-bold">InvoPk</h3>
              <p className="text-sm opacity-70">
                Simple invoicing for Pakistani freelancers.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <Link to="/invopk/help">Help</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm opacity-70">
            © {new Date().getFullYear()} InvoPk. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
