import { useSyncExternalStore } from "react";

const subscribe = (query: string) => (onStoreChange: () => void) => {
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", onStoreChange);

  return () => mediaQueryList.removeEventListener("change", onStoreChange);
};

const getServerSnapshot = (): boolean => false;

export const useMediaQuery = (query: string): boolean => {
  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe(query), getSnapshot, getServerSnapshot);
};
