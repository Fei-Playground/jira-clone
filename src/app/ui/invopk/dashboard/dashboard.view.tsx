import { Link } from "react-router";
import { TopHeader } from "../layout/top-header";
import { BottomNav } from "../layout/bottom-nav";
import { useInvoPkAuth } from "@app/store/invopk-auth.store";
import type { Invoice, InvoiceSummary } from "@domain/invopk";
import { formatCurrency, getStatusColor, getInitials } from "../utils/format";

interface DashboardViewProps {
  summary: InvoiceSummary;
  recentInvoices: Invoice[];
  clientNames: Record<string, string>;
}

export const DashboardView = ({
  summary,
  recentInvoices,
  clientNames,
}: DashboardViewProps): JSX.Element => {
  const { invoPkUser } = useInvoPkAuth();

  // PKR to USD exchange rate for approximate conversions in multi-currency display
  const PKR_TO_USD_RATE = 283;

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <TopHeader />

      <main className="mx-auto max-w-screen-xl px-5 pb-32 pt-6">
        {/* Welcome Header */}
        <section className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
            WELCOME BACK
          </p>
          <h2 className="text-2xl font-bold text-[#00236f]">
            {invoPkUser?.name}'s Dashboard
          </h2>
        </section>

        {/* Summary Grid (Bento Style) */}
        <section className="mb-8 grid grid-cols-2 gap-4">
          {/* Main Card (Spans 2 columns) */}
          <div className="relative col-span-2 overflow-hidden rounded-[24px] bg-[#00236f] p-6 text-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
            <div className="relative z-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-80">
                TOTAL INCOME
              </p>
              <div className="flex flex-col gap-1">
                <span className="text-[32px] font-bold leading-tight">
                  {formatCurrency(
                    summary.totalIncome,
                    invoPkUser?.defaultCurrency
                  )}
                </span>
                {invoPkUser?.defaultCurrency === "USD" && (
                  <span className="text-sm opacity-70">
                    ≈ Rs{" "}
                    {(summary.totalIncome * PKR_TO_USD_RATE).toLocaleString()}{" "}
                    PKR
                  </span>
                )}
              </div>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#90a8ff] opacity-20 blur-3xl"></div>
          </div>

          {/* Pending Card */}
          <div className="rounded-[24px] border border-[#e7eefe] bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4edea3]/20 text-[#005236]">
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
              PENDING
            </p>
            <span className="text-xl font-bold text-[#00236f]">
              {formatCurrency(
                summary.pendingAmount,
                invoPkUser?.defaultCurrency
              )}
            </span>
          </div>

          {/* Overdue Card */}
          <div className="rounded-[24px] border border-[#e7eefe] bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffdad6] text-[#93000a]">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
              OVERDUE
            </p>
            <span className="text-xl font-bold text-[#ba1a1a]">
              {formatCurrency(
                summary.overdueAmount,
                invoPkUser?.defaultCurrency
              )}
            </span>
          </div>
        </section>

        {/* Quick Action */}
        <section className="mb-8">
          <Link
            to="/invopk/invoices/new"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] text-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <span>➕</span>
            Create New Invoice
          </Link>
        </section>

        {/* Recent Invoices */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#00236f]">
              Recent Invoices
            </h3>
            <Link
              to="/invopk/invoices"
              className="text-xs font-semibold uppercase tracking-wider text-[#264191] hover:underline"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentInvoices.length === 0 ? (
              <div className="rounded-xl bg-white p-6 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-sm text-[#606365]">
                  No invoices yet. Create your first invoice to get started!
                </p>
              </div>
            ) : (
              recentInvoices.map((invoice) => (
                <Link
                  key={invoice.invoiceId}
                  to={`/invopk/invoices/${invoice.invoiceId}`}
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] transition-colors hover:bg-[#f0f3ff]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f8] font-bold text-[#00236f]">
                      {getInitials(clientNames[invoice.clientId] || "Unknown")}
                    </div>
                    <div>
                      <p className="font-semibold text-[#151c27]">
                        {clientNames[invoice.clientId] || "Unknown Client"}
                      </p>
                      <p className="text-sm text-[#606365]">
                        {invoice.invoiceNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-xl font-semibold text-[#151c27]">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
