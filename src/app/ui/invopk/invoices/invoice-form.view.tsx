import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { TopHeader } from "../layout/top-header";
import { BottomNav } from "../layout/bottom-nav";
import type {
  Invoice,
  InvoiceInput,
  LineItem,
  Currency,
  Client,
} from "@domain/invopk";
import { useInvoPkAuth } from "@app/store/invopk-auth.store";
import { formatDecimal } from "../utils/format";
import { v4 as uuid } from "uuid";

interface InvoiceFormViewProps {
  invoice?: Invoice;
  clients: Client[];
  onSubmit: (data: InvoiceInput) => Promise<void>;
  isEdit?: boolean;
}

export const InvoiceFormView = ({
  invoice,
  clients,
  onSubmit,
  isEdit = false,
}: InvoiceFormViewProps): JSX.Element => {
  const navigate = useNavigate();
  const { invoPkUser } = useInvoPkAuth();
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState(invoice?.clientId || "");
  const [issueDate, setIssueDate] = useState(
    invoice
      ? new Date(invoice.issueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    invoice
      ? new Date(invoice.dueDate).toISOString().split("T")[0]
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
  );
  const [currency, setCurrency] = useState<Currency>(
    invoice?.currency || invoPkUser?.defaultCurrency || "PKR"
  );
  const [items, setItems] = useState<LineItem[]>(
    invoice?.items || [
      {
        id: uuid(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]
  );
  const [taxPercentage, setTaxPercentage] = useState(
    invoice?.taxPercentage || 0
  );
  const [discountAmount, setDiscountAmount] = useState(
    invoice?.discountAmount || 0
  );
  const [notes, setNotes] = useState(invoice?.notes || "");
  const [paymentLink, setPaymentLink] = useState(invoice?.paymentLink || "");

  const calculateItemTotal = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTaxAmount = (): number => {
    return (calculateSubtotal() * taxPercentage) / 100;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateTaxAmount() - discountAmount;
  };

  const handleItemChange = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        if (field === "quantity" || field === "unitPrice") {
          updated.total = calculateItemTotal(
            updated.quantity,
            updated.unitPrice
          );
        }

        return updated;
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: uuid(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!clientId) {
      alert("Please select a client");
      return;
    }

    setLoading(true);

    try {
      const formData: InvoiceInput = {
        clientId,
        issueDate: new Date(issueDate).getTime(),
        dueDate: new Date(dueDate).getTime(),
        currency,
        items,
        taxPercentage,
        discountAmount,
        notes: notes || undefined,
        paymentLink: paymentLink || undefined,
      };

      await onSubmit(formData);
      navigate("/invopk/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <TopHeader />

      <main className="mx-auto max-w-screen-xl px-5 pb-32 pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#00236f]">
            {isEdit ? "Edit Invoice" : "Create Invoice"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Form Body */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Invoice Details Card */}
              <div className="rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="mb-4 flex items-center gap-2 text-[#00236f]">
                  <span className="text-2xl">ℹ️</span>
                  <h3 className="text-xl font-semibold">Invoice Details</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                      Select Client *
                    </label>
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                      required
                    >
                      <option value="">Select a client...</option>
                      {clients.map((client) => (
                        <option key={client.clientId} value={client.clientId}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                      Currency
                    </label>
                    <div className="flex w-fit rounded-lg bg-[#e7eefe] p-1">
                      <button
                        type="button"
                        onClick={() => setCurrency("PKR")}
                        className={`rounded-md px-6 py-2 font-bold transition-all ${
                          currency === "PKR"
                            ? "bg-white text-[#00236f] shadow-sm"
                            : "text-[#606365]"
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
                            : "text-[#606365]"
                        }`}
                      >
                        USD
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Card */}
              <div className="overflow-hidden rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#00236f]">
                    <span className="text-2xl">📋</span>
                    <h3 className="text-xl font-semibold">Line Items</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-sm font-semibold text-[#00236f] hover:underline"
                  >
                    <span>➕</span>
                    Add Item
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#c5c5d3]">
                        <th className="w-1/2 pb-3 text-xs font-semibold uppercase tracking-wider text-[#606365]">
                          Description
                        </th>
                        <th className="px-2 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#606365]">
                          Qty
                        </th>
                        <th className="px-2 pb-3 text-right text-xs font-semibold uppercase tracking-wider text-[#606365]">
                          Price
                        </th>
                        <th className="px-2 pb-3 text-right text-xs font-semibold uppercase tracking-wider text-[#606365]">
                          Total
                        </th>
                        <th className="w-8 pb-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="group border-b border-[#e7eefe] last:border-0"
                        >
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="h-10 w-full rounded border border-transparent bg-transparent px-2 transition-colors focus:border-[#c5c5d3] focus:outline-none"
                              placeholder="Service description..."
                              required
                            />
                          </td>
                          <td className="py-3 text-center">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "quantity",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="h-10 w-16 rounded border border-transparent bg-transparent text-center transition-colors focus:border-[#c5c5d3] focus:outline-none"
                              min="1"
                              required
                            />
                          </td>
                          <td className="py-3 text-right">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="h-10 w-24 rounded border border-transparent bg-transparent text-right transition-colors focus:border-[#c5c5d3] focus:outline-none"
                              step="0.01"
                              min="0"
                              required
                            />
                          </td>
                          <td className="py-3 text-right font-semibold">
                            {formatDecimal(item.total)}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-[#ba1a1a] opacity-0 transition-opacity group-hover:opacity-100"
                              disabled={items.length === 1}
                            >
                              <span className="text-xl">🗑️</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="mb-4 flex items-center gap-2 text-[#00236f]">
                  <span className="text-2xl">📝</span>
                  <h3 className="text-xl font-semibold">Additional Info</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                      Notes & Terms (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="resize-none rounded-lg border border-[#c5c5d3] p-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                      placeholder="Payment terms, thank you notes..."
                      rows={4}
                    />
                  </div>

                  {currency === "USD" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                        Payment Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={paymentLink}
                        onChange={(e) => setPaymentLink(e.target.value)}
                        className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                        placeholder="https://buy.stripe.com/..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Summary Card */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="rounded-[24px] border border-[#00236f]/5 bg-white p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
                <h3 className="mb-6 text-xl font-semibold text-[#151c27]">
                  Summary
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#606365]">Subtotal</span>
                    <span className="font-semibold">
                      {currency === "PKR" ? "Rs " : "$"}
                      {formatDecimal(calculateSubtotal())}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#606365]">Tax (%)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={taxPercentage}
                        onChange={(e) =>
                          setTaxPercentage(parseFloat(e.target.value) || 0)
                        }
                        className="h-8 w-12 rounded border border-[#c5c5d3] text-right text-xs transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                        step="0.1"
                        min="0"
                      />
                      <span className="font-semibold">
                        {formatDecimal(calculateTaxAmount())}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#606365]">Discount</span>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) =>
                        setDiscountAmount(parseFloat(e.target.value) || 0)
                      }
                      className="h-8 w-20 rounded border border-[#c5c5d3] text-right text-xs transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="border-t border-[#c5c5d3] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#151c27]">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-[#00236f]">
                        {currency === "PKR" ? "Rs " : "$"}
                        {formatDecimal(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00236f] font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : isEdit
                      ? "Update Invoice"
                      : "Create Invoice"}
                </button>
                <Link
                  to="/invopk/invoices"
                  className="flex h-12 items-center justify-center rounded-lg border border-[#757682] font-semibold text-[#151c27] transition-all hover:bg-[#e7eefe] active:scale-95"
                >
                  Cancel
                </Link>
              </div>
            </aside>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  );
};
