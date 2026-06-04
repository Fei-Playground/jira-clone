import { Link } from "react-router";

interface ProPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProPaywallModal = ({
  isOpen,
  onClose,
}: ProPaywallModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-md rounded-[24px] bg-white p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.15)]">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#00236f]">
            <span className="text-3xl">🚀</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-bold text-[#151c27]">
          Upgrade to Pro
        </h2>

        {/* Message */}
        <p className="mb-6 text-center text-sm leading-6 text-[#444651]">
          You've reached the free limit of 3 invoices. Upgrade to Pro for
          unlimited invoicing and advanced features.
        </p>

        {/* Pricing */}
        <div className="mb-6 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#00236f] p-6 text-white">
          <div className="mb-4 text-center">
            <div className="mb-1">
              <span className="text-4xl font-bold">Rs 300</span>
              <span className="text-sm opacity-80">/month</span>
            </div>
            <p className="text-xs opacity-70">or Rs 2,500/year (save 30%)</p>
          </div>

          <ul className="space-y-2 text-sm">
            {[
              "Unlimited invoices",
              "Recurring invoices",
              "Advanced filters",
              "Priority support",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-[#10B981]">✓</span>
                <span className="opacity-90">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Instructions */}
        <div className="mb-6 rounded-xl bg-[#f9f9ff] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#606365]">
            How to Upgrade
          </p>
          <div className="space-y-2 text-sm text-[#444651]">
            <p>
              <strong>For PKR:</strong> Send Rs 300 to JazzCash/EasyPaisa{" "}
              <span className="font-mono text-[#00236f]">03XX-XXXXXXX</span>
            </p>
            <p>
              <strong>For USD:</strong> Pay via{" "}
              <a
                href="#"
                className="font-semibold text-[#00236f] hover:underline"
              >
                PayRoute link
              </a>
            </p>
            <p className="text-xs text-[#757682]">
              After payment, email{" "}
              <a
                href="mailto:support@invopk.com"
                className="text-[#00236f] hover:underline"
              >
                support@invopk.com
              </a>{" "}
              with your email to activate Pro.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onClose}
            className="flex h-12 items-center justify-center rounded-xl border-2 border-[#00236f] bg-transparent font-semibold text-[#00236f] transition-all hover:bg-[#00236f]/5 active:scale-95"
          >
            I'll Upgrade Later
          </button>
          <Link
            to="/invopk/settings"
            className="flex h-12 items-center justify-center rounded-xl bg-[#00236f] font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          >
            View Upgrade Options
          </Link>
        </div>
      </div>
    </div>
  );
};
