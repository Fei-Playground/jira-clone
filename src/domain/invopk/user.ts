export type UserId = string;

export type Currency = "PKR" | "USD";

export interface InvoPkUser {
  uid: UserId;
  email: string;
  name: string;
  businessName?: string;
  defaultCurrency: Currency;
  isPro: boolean;
  invoiceCount: number;
  createdAt: number;
}

export interface OnboardingData {
  name: string;
  businessName?: string;
  defaultCurrency: Currency;
}
