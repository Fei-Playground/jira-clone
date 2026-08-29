import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.client";
import type { InvoPkUser, OnboardingData, UserId } from "@domain/invopk";

const USERS_COLLECTION = "users";

export const getUserProfile = async (userId: UserId): Promise<InvoPkUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      return userDoc.data() as InvoPkUser;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const createUserProfile = async (
  userId: UserId,
  email: string,
  onboardingData: OnboardingData
): Promise<void> => {
  try {
    const userProfile: InvoPkUser = {
      uid: userId,
      email,
      name: onboardingData.name,
      businessName: onboardingData.businessName,
      defaultCurrency: onboardingData.defaultCurrency,
      isPro: false,
      invoiceCount: 0,
      createdAt: Date.now(),
    };

    await setDoc(doc(db, USERS_COLLECTION, userId), userProfile);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: UserId,
  updates: Partial<InvoPkUser>
): Promise<void> => {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, userId), updates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const incrementInvoiceCount = async (userId: UserId): Promise<void> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      const currentCount = userDoc.data().invoiceCount || 0;
      await updateDoc(doc(db, USERS_COLLECTION, userId), {
        invoiceCount: currentCount + 1,
      });
    }
  } catch (error) {
    console.error("Error incrementing invoice count:", error);
    throw error;
  }
};
