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
} from "firebase/firestore";
import { db } from "./firebase.client";
import type { Client, ClientId, ClientInput, UserId } from "@domain/invopk";

const CLIENTS_COLLECTION = "clients";

export const getClient = async (clientId: ClientId): Promise<Client | null> => {
  try {
    const clientDoc = await getDoc(doc(db, CLIENTS_COLLECTION, clientId));
    if (clientDoc.exists()) {
      return { ...clientDoc.data(), clientId: clientDoc.id } as Client;
    }
    return null;
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};

export const getUserClients = async (userId: UserId): Promise<Client[]> => {
  try {
    const q = query(
      collection(db, CLIENTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ ...doc.data(), clientId: doc.id }) as Client);
  } catch (error) {
    console.error("Error fetching user clients:", error);
    throw error;
  }
};

export const createClient = async (userId: UserId, clientInput: ClientInput): Promise<ClientId> => {
  try {
    const clientData = {
      ...clientInput,
      userId,
      createdAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), clientData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const updateClient = async (
  clientId: ClientId,
  updates: Partial<ClientInput>
): Promise<void> => {
  try {
    await updateDoc(doc(db, CLIENTS_COLLECTION, clientId), updates);
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const deleteClient = async (clientId: ClientId): Promise<void> => {
  try {
    await deleteDoc(doc(db, CLIENTS_COLLECTION, clientId));
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};
