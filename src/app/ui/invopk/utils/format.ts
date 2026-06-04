import type { Currency } from "@domain/invopk";

/**
 * Format a number amount into a currency string with appropriate symbol
 * @param amount - The numeric amount to format
 * @param currency - The currency type (PKR or USD)
 */
export const formatCurrency = (amount: number, currency: Currency = "USD"): string => {
  if (currency === "PKR") {
    return `Rs ${amount.toLocaleString()}`;
  }
  return `$${amount.toLocaleString()}`;
};

/**
 * Format a number with fixed decimal places for display
 * Used primarily in invoice forms for precise amounts
 */
export const formatDecimal = (amount: number): string => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Get initials from a person or company name
 * Returns up to 2 uppercase letters
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get color classes for invoice status badges
 * Returns Tailwind classes for background and text color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Paid":
      return "bg-[#6ffbbe] text-[#005236]";
    case "Pending":
      return "bg-[#dce2f3] text-[#606365]";
    case "Overdue":
      return "bg-[#ffdad6] text-[#93000a]";
    case "Draft":
      return "bg-[#e7eefe] text-[#444651]";
    default:
      return "bg-[#e7eefe] text-[#606365]";
  }
};

/**
 * Format a timestamp into a readable date string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
