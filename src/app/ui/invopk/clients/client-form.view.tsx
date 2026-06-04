import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { TopHeader } from "../layout/top-header";
import { BottomNav } from "../layout/bottom-nav";
import type { Client, ClientInput } from "@domain/invopk";

interface ClientFormViewProps {
  client?: Client;
  onSubmit: (data: ClientInput) => Promise<void>;
  isEdit?: boolean;
}

export const ClientFormView = ({
  client,
  onSubmit,
  isEdit = false,
}: ClientFormViewProps): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientInput>({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    country: client?.country || "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      navigate("/invopk/clients");
    } catch (error) {
      console.error("Error saving client:", error);
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
            {isEdit ? "Edit Client" : "Add New Client"}
          </h2>
        </div>

        {/* Form Card */}
        <div className="rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                placeholder="+92 300 1234567"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Address (Optional)
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="resize-none rounded-lg border border-[#c5c5d3] p-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                placeholder="Street address, city, state"
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                Country (Optional)
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                placeholder="United States"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Link
                to="/invopk/clients"
                className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#757682] font-semibold text-[#151c27] transition-all hover:bg-[#e7eefe] active:scale-95"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#00236f] font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Client"
                    : "Add Client"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
