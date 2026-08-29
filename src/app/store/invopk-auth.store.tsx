import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@infrastructure/firebase/firebase.client";
import {
  getUserProfile,
  createUserProfile,
} from "@infrastructure/firebase/users";
import type { InvoPkUser, OnboardingData } from "@domain/invopk";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  invoPkUser: InvoPkUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    onboardingData: OnboardingData
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const InvoPkAuthProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [invoPkUser, setInvoPkUser] = useState<InvoPkUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      setInvoPkUser(profile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      setFirebaseUser(user);

      if (user) {
        const profile = await getUserProfile(user.uid);
        setInvoPkUser(profile);
      } else {
        setInvoPkUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    onboardingData: OnboardingData
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createUserProfile(userCredential.user.uid, email, onboardingData);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        invoPkUser,
        loading,
        signIn,
        signUp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useInvoPkAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useInvoPkAuth must be used within InvoPkAuthProvider");
  }
  return context;
};
