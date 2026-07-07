import { createContext, useContext, useState } from "react";
import { User } from "@domain/user";

interface UserStore {
  user: User;
  photoDataUrl: string | null;
  updatePhoto: (dataUrl: string | null) => void;
}

const UserContext = createContext<UserStore | undefined>(undefined);

export const UserContextProvider = ({
  user,
  children,
}: {
  user: User;
  children: JSX.Element;
}): JSX.Element => {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  const updatePhoto = (dataUrl: string | null) => {
    setPhotoDataUrl(dataUrl);
  };

  return (
    <UserContext.Provider value={{ user, photoDataUrl, updatePhoto }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserStore = (): UserStore => {
  const userStore = useContext(UserContext);
  if (!userStore) {
    throw new Error("User context not found");
  }
  return userStore;
};
