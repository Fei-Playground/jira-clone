import type { Meta, StoryObj } from "@storybook/react-vite";
import { createContext, type ReactNode } from "react";
import { createRoutesStub, Link, NavLink } from "react-router";
import type {
  InvoPkUser,
  Invoice,
  InvoiceSummary,
  Client,
  InvoiceStatus,
  Currency,
  LineItem,
} from "@domain/invopk";

// Import real components
import { LandingView } from "./landing/landing.view";
import { DashboardView } from "./dashboard/dashboard.view";
import { InvoicesListView } from "./invoices/invoices-list.view";
import { InvoiceFormView } from "./invoices/invoice-form.view";

// ========================================
// Mock Auth Context - provides the same interface as useInvoPkAuth
// The real components use useInvoPkAuth which reads from AuthContext
// We need to mock that context since Firebase isn't available in Storybook
// ========================================

// Re-create the AuthContext with the same interface the real hook expects
interface AuthState {
  firebaseUser: unknown;
  invoPkUser: InvoPkUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: unknown) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// This must be exported with the same name the hook checks for
const AuthContext = createContext<AuthState | undefined>(undefined);

// Mock provider that gives the same context shape as the real InvoPkAuthProvider
const MockInvoPkAuthProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: InvoPkUser;
}): JSX.Element => {
  const mockAuthState: AuthState = {
    firebaseUser: null,
    invoPkUser: user,
    loading: false,
    signIn: async () => {},
    signUp: async () => {},
    logout: async () => {},
    refreshUser: async () => {},
  };

  return (
    <AuthContext.Provider value={mockAuthState}>
      {children}
    </AuthContext.Provider>
  );
};

// We need to patch the module's context - but we can't do that cleanly
// So instead we'll use a decorator approach that wraps the real components
// with providers that satisfy their dependencies

// ========================================
// Mock Data
// ========================================
const mockInvoPkUser: InvoPkUser = {
  uid: "user-1",
  email: "ali.khan@example.com",
  name: "Ali Khan",
  businessName: "Ali's Web Solutions",
  defaultCurrency: "PKR",
  isPro: false,
  invoiceCount: 5,
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
};

const mockClients: Client[] = [
  {
    clientId: "client-1",
    userId: "user-1",
    name: "Tech Startup Inc",
    email: "contact@techstartup.com",
    phone: "+1-555-0123",
    address: "123 Silicon Valley, CA",
    country: "USA",
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    clientId: "client-2",
    userId: "user-1",
    name: "Local Business Pk",
    email: "info@localbiz.pk",
    phone: "+92-300-1234567",
    address: "45 Blue Area, Islamabad",
    country: "Pakistan",
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
  },
  {
    clientId: "client-3",
    userId: "user-1",
    name: "Global Design Agency",
    email: "projects@globaldesign.co",
    phone: "+44-20-7123-4567",
    address: "10 Soho Square, London",
    country: "UK",
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
];

const clientNames: Record<string, string> = {
  "client-1": "Tech Startup Inc",
  "client-2": "Local Business Pk",
  "client-3": "Global Design Agency",
};

const mockInvoices: Invoice[] = [
  {
    invoiceId: "inv-1",
    userId: "user-1",
    clientId: "client-1",
    invoiceNumber: "INV-001",
    issueDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 9 * 24 * 60 * 60 * 1000,
    currency: "USD",
    items: [
      {
        id: "item-1",
        description: "Web Development",
        quantity: 1,
        unitPrice: 1500,
        total: 1500,
      },
      {
        id: "item-2",
        description: "UI/UX Design",
        quantity: 1,
        unitPrice: 800,
        total: 800,
      },
    ],
    subtotal: 2300,
    taxPercentage: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 2300,
    status: "Pending",
    notes: "Payment due within 14 days",
    paymentLink: "https://payroute.pk/pay/ali-khan",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    invoiceId: "inv-2",
    userId: "user-1",
    clientId: "client-2",
    invoiceNumber: "INV-002",
    issueDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() - 16 * 24 * 60 * 60 * 1000,
    currency: "PKR",
    items: [
      {
        id: "item-3",
        description: "Website Maintenance",
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
      },
    ],
    subtotal: 25000,
    taxPercentage: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 25000,
    status: "Overdue",
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    invoiceId: "inv-3",
    userId: "user-1",
    clientId: "client-3",
    invoiceNumber: "INV-003",
    issueDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() - 31 * 24 * 60 * 60 * 1000,
    currency: "USD",
    items: [
      {
        id: "item-4",
        description: "Logo Design",
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
      {
        id: "item-5",
        description: "Brand Guidelines",
        quantity: 1,
        unitPrice: 300,
        total: 300,
      },
    ],
    subtotal: 800,
    taxPercentage: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 800,
    status: "Paid",
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 32 * 24 * 60 * 60 * 1000,
  },
  {
    invoiceId: "inv-4",
    userId: "user-1",
    clientId: "client-1",
    invoiceNumber: "INV-004",
    issueDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() - 46 * 24 * 60 * 60 * 1000,
    currency: "USD",
    items: [
      {
        id: "item-6",
        description: "Mobile App MVP",
        quantity: 1,
        unitPrice: 3500,
        total: 3500,
      },
    ],
    subtotal: 3500,
    taxPercentage: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 3500,
    status: "Paid",
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 47 * 24 * 60 * 60 * 1000,
  },
  {
    invoiceId: "inv-5",
    userId: "user-1",
    clientId: "client-2",
    invoiceNumber: "INV-005",
    issueDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
    dueDate: Date.now() + 12 * 24 * 60 * 60 * 1000,
    currency: "PKR",
    items: [
      {
        id: "item-7",
        description: "SEO Optimization",
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
      {
        id: "item-8",
        description: "Content Writing (5 articles)",
        quantity: 5,
        unitPrice: 2000,
        total: 10000,
      },
    ],
    subtotal: 25000,
    taxPercentage: 5,
    taxAmount: 1250,
    discountAmount: 1000,
    total: 25250,
    status: "Pending",
    notes: "Includes 5 blog articles optimized for SEO",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

const mockSummary: InvoiceSummary = {
  totalIncome: 6600,
  pendingAmount: 2300,
  overdueAmount: 88,
  invoiceCount: {
    total: 5,
    pending: 2,
    paid: 2,
    overdue: 1,
  },
};

// ========================================
// Inline layout components that mock the auth-dependent ones
// The real TopHeader/BottomNav use useInvoPkAuth which we can't easily mock
// ========================================

const MockTopHeader = ({ user }: { user: InvoPkUser }): JSX.Element => {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#1e3a8a]">
            <span className="font-bold text-white">
              {getInitials(user.name)}
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#00236f]">
          InvoPk
        </h1>
        <div className="flex items-center">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#00236f] transition-colors hover:bg-[#e2e8f8] active:scale-95">
            <span className="text-2xl">🔔</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const MockBottomNav = (): JSX.Element => {
  const navItems = [
    { to: "/invopk/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/invopk/invoices", icon: "📄", label: "Invoices" },
    { to: "/invopk/clients", icon: "👤", label: "Clients" },
    { to: "/invopk/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-[#c5c5d3] bg-white px-4 py-3 shadow-[0px_-4px_16px_rgba(0,0,0,0.04)] md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all active:scale-90 ${
              isActive
                ? "bg-[#1e3a8a] text-white"
                : "text-[#606365] hover:opacity-80"
            }`
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-wider">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

// ========================================
// Mock Dashboard View - visually identical to real but accepts user as prop
// The real DashboardView uses useInvoPkAuth internally, we can't easily inject
// ========================================
interface MockDashboardViewProps {
  summary: InvoiceSummary;
  recentInvoices: Invoice[];
  clientNames: Record<string, string>;
  user: InvoPkUser;
}

const MockDashboardView = ({
  summary,
  recentInvoices,
  clientNames,
  user,
}: MockDashboardViewProps): JSX.Element => {
  const formatCurrency = (amount: number, currency: string = "USD"): string => {
    if (currency === "PKR") {
      return `Rs ${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Paid":
        return "bg-[#6ffbbe] text-[#005236]";
      case "Pending":
        return "bg-[#dce2f3] text-[#606365]";
      case "Overdue":
        return "bg-[#ffdad6] text-[#93000a]";
      default:
        return "bg-[#e7eefe] text-[#606365]";
    }
  };

  const getClientInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <MockTopHeader user={user} />

      <main className="mx-auto max-w-screen-xl px-5 pb-32 pt-6">
        <section className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
            WELCOME BACK
          </p>
          <h2 className="text-2xl font-bold text-[#00236f]">
            {user.name}'s Dashboard
          </h2>
        </section>

        <section className="mb-8 grid grid-cols-2 gap-4">
          <div className="relative col-span-2 overflow-hidden rounded-[24px] bg-[#00236f] p-6 text-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
            <div className="relative z-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-80">
                TOTAL INCOME
              </p>
              <div className="flex flex-col gap-1">
                <span className="text-[32px] font-bold leading-tight">
                  {formatCurrency(summary.totalIncome, user.defaultCurrency)}
                </span>
                {user.defaultCurrency === "USD" && (
                  <span className="text-sm opacity-70">
                    ≈ Rs {(summary.totalIncome * 283).toLocaleString()} PKR
                  </span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#90a8ff] opacity-20 blur-3xl"></div>
          </div>

          <div className="rounded-[24px] border border-[#e7eefe] bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4edea3]/20 text-[#005236]">
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
              PENDING
            </p>
            <span className="text-xl font-bold text-[#00236f]">
              {formatCurrency(summary.pendingAmount, user.defaultCurrency)}
            </span>
          </div>

          <div className="rounded-[24px] border border-[#e7eefe] bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffdad6] text-[#93000a]">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#606365]">
              OVERDUE
            </p>
            <span className="text-xl font-bold text-[#ba1a1a]">
              {formatCurrency(summary.overdueAmount, user.defaultCurrency)}
            </span>
          </div>
        </section>

        <section className="mb-8">
          <Link
            to="/invopk/invoices/new"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] text-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <span>➕</span>
            Create New Invoice
          </Link>
        </section>

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
            {recentInvoices.map((invoice) => (
              <Link
                key={invoice.invoiceId}
                to={`/invopk/invoices/${invoice.invoiceId}`}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] transition-colors hover:bg-[#f0f3ff]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f8] font-bold text-[#00236f]">
                    {getClientInitials(
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
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#151c27]">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MockBottomNav />
    </div>
  );
};

// ========================================
// Mock Invoices List View
// ========================================
interface MockInvoicesListViewProps {
  invoices: Invoice[];
  clientNames: Record<string, string>;
  user: InvoPkUser;
  onStatusChange: (invoiceId: string, status: InvoiceStatus) => void;
}

const MockInvoicesListView = ({
  invoices,
  clientNames,
  user,
  onStatusChange,
}: MockInvoicesListViewProps): JSX.Element => {
  const formatCurrency = (amount: number, currency: string = "USD"): string => {
    if (currency === "PKR") {
      return `Rs ${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Paid":
        return "bg-[#6ffbbe] text-[#005236]";
      case "Pending":
        return "bg-[#dce2f3] text-[#606365]";
      case "Overdue":
        return "bg-[#ffdad6] text-[#93000a]";
      default:
        return "bg-[#e7eefe] text-[#606365]";
    }
  };

  const getClientInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusOptions: (InvoiceStatus | "All")[] = [
    "All",
    "Pending",
    "Paid",
    "Overdue",
    "Draft",
  ];

  const pendingCount = invoices.filter((i) => i.status === "Pending").length;
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <MockTopHeader user={user} />

      <main className="mx-auto max-w-screen-xl px-5 pb-32 pt-6">
        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-[#00236f]">Invoices</h2>

          <div className="mb-4 flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  status === "All"
                    ? "bg-[#00236f] text-white"
                    : "bg-white text-[#606365] hover:bg-[#e7eefe]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <Link
            to="/invopk/invoices/new"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] text-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <span>➕</span>
            Create New Invoice
          </Link>
        </section>

        <section className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#f59e0b]">{pendingCount}</p>
            <p className="text-sm text-[#606365]">Pending</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#10b981]">{paidCount}</p>
            <p className="text-sm text-[#606365]">Paid</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#ef4444]">{overdueCount}</p>
            <p className="text-sm text-[#606365]">Overdue</p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          {invoices.map((invoice) => (
            <div key={invoice.invoiceId} className="rounded-xl bg-white shadow-sm">
              <Link
                to={`/invopk/invoices/${invoice.invoiceId}`}
                className="flex items-center justify-between p-4 transition-colors hover:bg-[#f0f3ff]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f8] font-bold text-[#00236f]">
                    {getClientInitials(
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
                  <p className="font-bold text-[#151c27]">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </Link>
              {invoice.status !== "Paid" && (
                <div className="flex gap-2 border-t border-[#e7eefe] px-4 py-3">
                  <button
                    onClick={() => onStatusChange(invoice.invoiceId, "Paid")}
                    className="flex-1 rounded-lg bg-[#e7eefe] py-2 text-sm font-semibold text-[#00236f] transition-all hover:bg-[#d0d8f0]"
                  >
                    Mark as Paid
                  </button>
                  <Link
                    to={`/invopk/invoices/${invoice.invoiceId}/edit`}
                    className="flex-1 rounded-lg border border-[#c5c5d3] py-2 text-center text-sm font-semibold text-[#606365] transition-all hover:bg-[#f5f5f5]"
                  >
                    Edit
                  </Link>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      <MockBottomNav />
    </div>
  );
};

// ========================================
// Mock Invoice Form View
// ========================================
interface MockInvoiceFormViewProps {
  invoice?: Invoice;
  clients: Client[];
  user: InvoPkUser;
  isEdit?: boolean;
}

const MockInvoiceFormView = ({
  invoice,
  clients,
  user,
  isEdit = false,
}: MockInvoiceFormViewProps): JSX.Element => {
  const defaultCurrency = invoice?.currency || user.defaultCurrency || "PKR";
  const currency = defaultCurrency;

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const defaultItems: LineItem[] = invoice?.items || [
    {
      id: "item-new-1",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ];

  const calculateSubtotal = (): number => {
    return defaultItems.reduce((sum, item) => sum + item.total, 0);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <MockTopHeader user={user} />

      <main className="mx-auto max-w-screen-xl px-5 pb-32 pt-6">
        <h2 className="mb-6 text-2xl font-bold text-[#00236f]">
          {isEdit ? "Edit Invoice" : "Create Invoice"}
        </h2>

        <form className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Invoice Details Card */}
            <div className="rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
              <div className="mb-4 flex items-center gap-2 text-[#00236f]">
                <span className="text-2xl">ℹ️</span>
                <h3 className="text-xl font-semibold">Invoice Details</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                    Select Client *
                  </label>
                  <select
                    defaultValue={invoice?.clientId || ""}
                    className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
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
                  <div className="flex rounded-lg border border-[#c5c5d3] overflow-hidden">
                    <button
                      type="button"
                      className={`flex-1 py-3 font-semibold transition-colors ${
                        currency === "PKR"
                          ? "bg-[#00236f] text-white"
                          : "bg-white text-[#606365] hover:bg-[#e7eefe]"
                      }`}
                    >
                      PKR
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3 font-semibold transition-colors ${
                        currency === "USD"
                          ? "bg-[#00236f] text-white"
                          : "bg-white text-[#606365] hover:bg-[#e7eefe]"
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
                    defaultValue={
                      invoice
                        ? formatDate(invoice.issueDate)
                        : formatDate(Date.now())
                    }
                    className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    defaultValue={
                      invoice
                        ? formatDate(invoice.dueDate)
                        : formatDate(Date.now() + 14 * 24 * 60 * 60 * 1000)
                    }
                    className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Card */}
            <div className="rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00236f]">
                  <span className="text-2xl">📋</span>
                  <h3 className="text-xl font-semibold">Line Items</h3>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg bg-[#e7eefe] px-3 py-2 text-sm font-semibold text-[#00236f] transition-all hover:bg-[#d0d8f0]"
                >
                  <span>➕</span>
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e7eefe] text-left text-xs font-semibold uppercase tracking-wider text-[#606365]">
                      <th className="pb-3">Description</th>
                      <th className="pb-3 text-center">Qty</th>
                      <th className="pb-3 text-right">Price</th>
                      <th className="pb-3 text-right">Total</th>
                      <th className="pb-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaultItems.map((item) => (
                      <tr key={item.id} className="group border-b border-[#f5f5f5]">
                        <td className="py-3">
                          <input
                            type="text"
                            defaultValue={item.description}
                            placeholder="Service description..."
                            className="h-10 w-full rounded border border-transparent bg-transparent px-2 transition-colors focus:border-[#c5c5d3] focus:outline-none"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            defaultValue={item.quantity}
                            min="1"
                            className="h-10 w-16 rounded border border-transparent bg-transparent text-center transition-colors focus:border-[#c5c5d3] focus:outline-none"
                          />
                        </td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            defaultValue={item.unitPrice}
                            className="h-10 w-24 rounded border border-transparent bg-transparent text-right transition-colors focus:border-[#c5c5d3] focus:outline-none"
                          />
                        </td>
                        <td className="py-3 text-right font-semibold text-[#151c27]">
                          {formatCurrency(item.total)}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            type="button"
                            className="text-[#ba1a1a] opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes Card */}
            <div className="rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
              <div className="mb-4 flex items-center gap-2 text-[#00236f]">
                <span className="text-2xl">📝</span>
                <h3 className="text-xl font-semibold">Notes & Payment</h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                    Notes (optional)
                  </label>
                  <textarea
                    defaultValue={invoice?.notes || ""}
                    className="min-h-[100px] rounded-lg border border-[#c5c5d3] p-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                    placeholder="Add payment instructions or notes..."
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#606365]">
                    Payment Link (optional)
                  </label>
                  <input
                    type="url"
                    defaultValue={invoice?.paymentLink || ""}
                    className="h-12 rounded-lg border border-[#c5c5d3] px-4 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                    placeholder="https://payroute.pk/pay/your-link"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-[24px] bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
              <h3 className="mb-4 text-xl font-semibold text-[#00236f]">
                Summary
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#606365]">Subtotal</span>
                  <span className="font-semibold text-[#151c27]">
                    {currency === "PKR" ? "Rs " : "$"}
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#606365]">Tax (0%)</span>
                  <span className="font-semibold text-[#151c27]">
                    {currency === "PKR" ? "Rs " : "$"}0.00
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#606365]">Discount</span>
                  <span className="font-semibold text-[#151c27]">
                    -{currency === "PKR" ? "Rs " : "$"}0.00
                  </span>
                </div>

                <div className="my-2 border-t border-[#e7eefe]"></div>

                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-[#00236f]">
                    Total
                  </span>
                  <span className="text-xl font-bold text-[#00236f]">
                    {currency === "PKR" ? "Rs " : "$"}
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  {isEdit ? "Update Invoice" : "Create Invoice"}
                </button>
                <Link
                  to="/invopk/invoices"
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-[#757682] font-semibold text-[#151c27] transition-all hover:bg-[#e7eefe] active:scale-[0.98]"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>

      <MockBottomNav />
    </div>
  );
};

// ========================================
// Meta
// ========================================
const meta: Meta = {
  title: "InvoPk",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

// ========================================
// Landing Page Story
// ========================================
export const Landing: StoryObj<typeof LandingView> = {
  render: () => <LandingView />,
  decorators: [
    (Story) => {
      const RouteStub = createRoutesStub([
        {
          path: "*",
          Component: () => <Story />,
        },
      ]);
      return <RouteStub initialEntries={["/"]} />;
    },
  ],
};

// ========================================
// Dashboard Story
// ========================================
export const Dashboard: StoryObj = {
  render: () => (
    <MockDashboardView
      summary={mockSummary}
      recentInvoices={mockInvoices.slice(0, 3)}
      clientNames={clientNames}
      user={mockInvoPkUser}
    />
  ),
  decorators: [
    (Story) => {
      const RouteStub = createRoutesStub([
        {
          path: "*",
          Component: () => <Story />,
        },
      ]);
      return <RouteStub initialEntries={["/invopk/dashboard"]} />;
    },
  ],
};

// ========================================
// Invoices List Story
// ========================================
export const InvoicesList: StoryObj = {
  render: () => (
    <MockInvoicesListView
      invoices={mockInvoices}
      clientNames={clientNames}
      user={mockInvoPkUser}
      onStatusChange={(invoiceId, status) => {
        // In a real app, this would update the invoice status in the database
      }}
    />
  ),
  decorators: [
    (Story) => {
      const RouteStub = createRoutesStub([
        {
          path: "*",
          Component: () => <Story />,
        },
      ]);
      return <RouteStub initialEntries={["/invopk/invoices"]} />;
    },
  ],
};

// ========================================
// Invoice Form Story (Create New)
// ========================================
export const InvoiceForm: StoryObj = {
  render: () => (
    <MockInvoiceFormView clients={mockClients} user={mockInvoPkUser} />
  ),
  decorators: [
    (Story) => {
      const RouteStub = createRoutesStub([
        {
          path: "*",
          Component: () => <Story />,
        },
      ]);
      return <RouteStub initialEntries={["/invopk/invoices/new"]} />;
    },
  ],
};

// ========================================
// Invoice Form Edit Story
// ========================================
export const InvoiceFormEdit: StoryObj = {
  render: () => (
    <MockInvoiceFormView
      invoice={mockInvoices[0]}
      clients={mockClients}
      user={mockInvoPkUser}
      isEdit={true}
    />
  ),
  decorators: [
    (Story) => {
      const RouteStub = createRoutesStub([
        {
          path: "*",
          Component: () => <Story />,
        },
      ]);
      return <RouteStub initialEntries={["/invopk/invoices/inv-1/edit"]} />;
    },
  ],
};

// ========================================
// Dashboard USD Story (shows multi-currency)
// ========================================
const usdUser: InvoPkUser = {
  ...mockInvoPkUser,
  name: "Sara Ahmed",
  defaultCurrency: "USD",
  isPro: true,
};

export const DashboardUSD: StoryObj = {
  render: () => (
    <MockDashboardView
      summary={mockSummary}
      recentInvoices={mockInvoices.slice(0, 3)}
      clientNames={clientNames}
      user={usdUser}
    />
  ),
  decorators: [
    (Story) => {
      const RouteStub = createRoutesStub([
        {
          path: "*",
          Component: () => <Story />,
        },
      ]);
      return <RouteStub initialEntries={["/invopk/dashboard"]} />;
    },
  ],
};
