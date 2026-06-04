import type { UserId } from "./user";

export type ClientId = string;

export interface Client {
  clientId: ClientId;
  userId: UserId;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  createdAt: number;
}

export interface ClientInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
}
