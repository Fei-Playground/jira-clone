import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase.client";
import type {
  Invoice,
  InvoiceId,
  InvoiceInput,
  InvoiceStatus,
  InvoiceSummary,
  UserId,
} from "@domain/invopk";

const INVOICES_COLLECTION = "invoices";

const calculateSubtotal = (items: Invoice["items"]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

const calculateTaxAmount = (subtotal: number, taxPercentage: number): number => {
  return (subtotal * taxPercentage) / 100;
};

const calculateTotal = (subtotal: number, taxAmount: number, discountAmount: number): number => {
  return subtotal + taxAmount - discountAmount;
};

const determineInvoiceStatus = (dueDate: number, currentStatus: InvoiceStatus): InvoiceStatus => {
  if (currentStatus === "Paid" || currentStatus === "Draft") {
    return currentStatus;
  }

  const now = Date.now();
  if (now > dueDate) {
    return "Overdue";
  }

  return "Pending";
};

export const getInvoice = async (invoiceId: InvoiceId): Promise<Invoice | null> => {
  try {
    const invoiceDoc = await getDoc(doc(db, INVOICES_COLLECTION, invoiceId));
    if (invoiceDoc.exists()) {
      const invoice = {
        ...invoiceDoc.data(),
        invoiceId: invoiceDoc.id,
      } as Invoice;

      // Auto-update status if overdue
      const updatedStatus = determineInvoiceStatus(invoice.dueDate, invoice.status);
      if (updatedStatus !== invoice.status) {
        await updateInvoiceStatus(invoiceId, updatedStatus);
        invoice.status = updatedStatus;
      }

      return invoice;
    }
    return null;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

export const getUserInvoices = async (
  userId: UserId,
  statusFilter?: InvoiceStatus
): Promise<Invoice[]> => {
  try {
    let q = query(
      collection(db, INVOICES_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    if (statusFilter) {
      q = query(q, where("status", "==", statusFilter));
    }

    const snapshot = await getDocs(q);
    const invoices = snapshot.docs.map((doc: any) => ({ ...doc.data(), invoiceId: doc.id }) as Invoice);

    // Auto-update overdue invoices
    const updatedInvoices = await Promise.all(
      invoices.map(async (invoice: Invoice) => {
        const updatedStatus = determineInvoiceStatus(invoice.dueDate, invoice.status);
        if (updatedStatus !== invoice.status) {
          await updateInvoiceStatus(invoice.invoiceId, updatedStatus);
          return { ...invoice, status: updatedStatus };
        }
        return invoice;
      })
    );

    return updatedInvoices;
  } catch (error) {
    console.error("Error fetching user invoices:", error);
    throw error;
  }
};

export const getRecentInvoices = async (
  userId: UserId,
  limitCount: number = 5
): Promise<Invoice[]> => {
  try {
    const q = query(
      collection(db, INVOICES_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ ...doc.data(), invoiceId: doc.id }) as Invoice);
  } catch (error) {
    console.error("Error fetching recent invoices:", error);
    throw error;
  }
};

export const generateInvoiceNumber = async (userId: UserId): Promise<string> => {
  try {
    const q = query(
      collection(db, INVOICES_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    const year = new Date().getFullYear();

    if (snapshot.empty) {
      return `INV-${year}-001`;
    }

    const lastInvoice = snapshot.docs[0].data() as Invoice;
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-")[2]);
    const newNumber = (lastNumber + 1).toString().padStart(3, "0");

    return `INV-${year}-${newNumber}`;
  } catch (error) {
    console.error("Error generating invoice number:", error);
    throw error;
  }
};

export const createInvoice = async (
  userId: UserId,
  invoiceInput: InvoiceInput
): Promise<InvoiceId> => {
  try {
    const subtotal = calculateSubtotal(invoiceInput.items);
    const taxAmount = calculateTaxAmount(subtotal, invoiceInput.taxPercentage);
    const total = calculateTotal(subtotal, taxAmount, invoiceInput.discountAmount);

    const invoiceNumber = await generateInvoiceNumber(userId);

    const invoiceData: Omit<Invoice, "invoiceId"> = {
      userId,
      ...invoiceInput,
      invoiceNumber,
      subtotal,
      taxAmount,
      total,
      status: "Pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, INVOICES_COLLECTION), invoiceData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (
  invoiceId: InvoiceId,
  updates: Partial<InvoiceInput>
): Promise<void> => {
  try {
    const updatedData: Record<string, unknown> = { ...updates, updatedAt: Date.now() };

    if (updates.items) {
      const subtotal = calculateSubtotal(updates.items);
      updatedData.subtotal = subtotal;

      if (updates.taxPercentage !== undefined) {
        updatedData.taxAmount = calculateTaxAmount(subtotal, updates.taxPercentage);
      }

      if (updates.discountAmount !== undefined) {
        updatedData.total = calculateTotal(
          subtotal,
          updatedData.taxAmount as number,
          updates.discountAmount
        );
      }
    }

    await updateDoc(doc(db, INVOICES_COLLECTION, invoiceId), updatedData);
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const updateInvoiceStatus = async (
  invoiceId: InvoiceId,
  status: InvoiceStatus
): Promise<void> => {
  try {
    await updateDoc(doc(db, INVOICES_COLLECTION, invoiceId), {
      status,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    throw error;
  }
};

export const deleteInvoice = async (invoiceId: InvoiceId): Promise<void> => {
  try {
    await deleteDoc(doc(db, INVOICES_COLLECTION, invoiceId));
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

export const getInvoiceSummary = async (userId: UserId): Promise<InvoiceSummary> => {
  try {
    const invoices = await getUserInvoices(userId);

    const summary: InvoiceSummary = {
      totalIncome: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      invoiceCount: {
        total: invoices.length,
        pending: 0,
        paid: 0,
        overdue: 0,
      },
    };

    invoices.forEach((invoice) => {
      if (invoice.status === "Paid") {
        summary.totalIncome += invoice.total;
        summary.invoiceCount.paid++;
      } else if (invoice.status === "Pending") {
        summary.pendingAmount += invoice.total;
        summary.invoiceCount.pending++;
      } else if (invoice.status === "Overdue") {
        summary.overdueAmount += invoice.total;
        summary.invoiceCount.overdue++;
      }
    });

    return summary;
  } catch (error) {
    console.error("Error calculating invoice summary:", error);
    throw error;
  }
};
