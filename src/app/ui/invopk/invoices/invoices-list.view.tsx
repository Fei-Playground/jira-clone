import { useState } from "react";
import { Link } from "react-router";
import { TopHeader } from "../layout/top-header";
import { BottomNav } from "../layout/bottom-nav";
import type { Invoice, InvoiceStatus } from "@domain/invopk";
import { useInvoPkAuth } from "@app/store/invopk-auth.store";
import {
  formatCurrency,
  getStatusColor,
  getInitials,
  formatDate,
} from "../utils/format";

interface InvoicesListViewProps {
  invoices: Invoice[];
  clientNames: Record<string, string>;
  onStatusChange: (invoiceId: string, status: InvoiceStatus) => void;
}

export const InvoicesListView = ({
  invoices,
  clientNames,
  onStatusChange,
}: InvoicesListViewProps): JSX.Element => {
  const { invoPkUser } = useInvoPkAuth();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "All">(
    "All"
  );

  const filteredInvoices =
    statusFilter === "All"
      ? invoices
      : invoices.filter((inv) => inv.status === statusFilter);

  const statusOptions: (InvoiceStatus | "All")[] = [
    "All",
    "Pending",
    "Paid",
    "Overdue",
    "Draft",
  ];

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <TopHeader />

      <main className="mx-auto max-w-screen-xl px-5 pb-32 pt-6">
        {/* Header */}
        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-[#00236f]">Invoices</h2>

          {/* Status Filter */}
          <div className="custom-scroll mb-4 flex gap-2 overflow-x-auto pb-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? "bg-[#00236f] text-white"
                    : "bg-white text-[#606365] hover:bg-[#e7eefe]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Add Invoice Button */}
          <Link
            to="/invopk/invoices/new"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] text-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <span>➕</span>
            Create New Invoice
          </Link>
        </section>

        {/* Invoice Stats */}
        <section className="mb-6 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white p-3 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <p className="mb-1 text-2xl font-bold text-[#00236f]">
              {invoices.filter((i) => i.status === "Pending").length}
            </p>
            <p className="text-xs text-[#606365]">Pending</p>
          </div>
          <div className="rounded-lg bg-white p-3 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <p className="mb-1 text-2xl font-bold text-[#10B981]">
              {invoices.filter((i) => i.status === "Paid").length}
            </p>
            <p className="text-xs text-[#606365]">Paid</p>
          </div>
          <div className="rounded-lg bg-white p-3 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <p className="mb-1 text-2xl font-bold text-[#ba1a1a]">
              {invoices.filter((i) => i.status === "Overdue").length}
            </p>
            <p className="text-xs text-[#606365]">Overdue</p>
          </div>
        </section>

        {/* Invoices List */}
        <section>
          {filteredInvoices.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
              <p className="text-sm text-[#606365]">
                {statusFilter === "All"
                  ? "No invoices yet. Create your first invoice to get started!"
                  : `No ${statusFilter.toLowerCase()} invoices found.`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.invoiceId}
                  className="rounded-xl bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.02)]"
                >
                  <Link
                    to={`/invopk/invoices/${invoice.invoiceId}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f8] font-bold text-[#00236f]">
                        {getInitials(
                          clientNames[invoice.clientId] || "Unknown"
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#151c27]">
                          {clientNames[invoice.clientId] || "Unknown Client"}
                        </p>
                        <p className="text-sm text-[#606365]">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-xs text-[#757682]">
                          Due: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-1 text-xl font-semibold text-[#151c27]">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </p>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </Link>

                  {/* Quick Actions */}
                  {invoice.status !== "Paid" && (
                    <div className="mt-3 flex gap-2 border-t border-[#e7eefe] pt-3">
                      <button
                        onClick={() =>
                          onStatusChange(invoice.invoiceId, "Paid")
                        }
                        className="flex-1 rounded-lg bg-[#6ffbbe] py-2 text-sm font-semibold text-[#005236] transition-all hover:opacity-90 active:scale-95"
                      >
                        Mark as Paid
                      </button>
                      <Link
                        to={`/invopk/invoices/${invoice.invoiceId}/edit`}
                        className="flex-1 rounded-lg border border-[#757682] py-2 text-center text-sm font-semibold text-[#151c27] transition-all hover:bg-[#e7eefe] active:scale-95"
                      >
                        Edit
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
