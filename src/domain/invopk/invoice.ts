import type { Currency, UserId } from "./user";
import type { ClientId } from "./client";

export type InvoiceId = string;

export type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  invoiceId: InvoiceId;
  userId: UserId;
  clientId: ClientId;
  invoiceNumber: string;
  issueDate: number;
  dueDate: number;
  currency: Currency;
  items: LineItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes?: string;
  status: InvoiceStatus;
  paymentLink?: string;
  createdAt: number;
  updatedAt: number;
}

export interface InvoiceInput {
  clientId: ClientId;
  issueDate: number;
  dueDate: number;
  currency: Currency;
  items: LineItem[];
  taxPercentage: number;
  discountAmount: number;
  notes?: string;
  paymentLink?: string;
}

export interface InvoiceSummary {
  totalIncome: number;
  pendingAmount: number;
  overdueAmount: number;
  invoiceCount: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
  };
}
