import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { useFetcher } from "react-router";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  LAVA = "lava",
  LIME = "lime",
  BARBIE = "barbie",
}
export const themes: Array<Theme> = Object.values(Theme);
export enum Preference {
  SELECTED = "selected",
  SYSTEM = "system",
}
const preferences: Array<Preference> = Object.values(Preference);

export const DEFAULT_THEME: Theme = Theme.LIGHT;
const DEFAULT_PREFERENCE: Preference = Preference.SYSTEM;

type ThemeContextType = {
  theme: Theme | null;
  preference: Preference | null;
  setTheme: (theme: Theme, preference?: Preference) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

// Inspired from Kent C. Dodds repo https://github.com/kentcdodds/kentcdodds.com/blob/main/app/utils/theme-provider.tsx
const prefersLightMQ = "(prefers-color-scheme: light)";
export const getSystemTheme = (): Theme =>
  window.matchMedia(prefersLightMQ).matches ? Theme.LIGHT : Theme.DARK;
const subscribeToSystemTheme = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(prefersLightMQ);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

export const ThemeProvider = ({
  children,
  specifiedTheme,
  specifiedPreference,
}: ThemeProviderProps) => {
  const [storedTheme, setThemeState] = useState<Theme | null>(() =>
    isValidTheme(specifiedTheme) ? specifiedTheme : null
  );
  // Without a theme in the session, fall back to the system theme. Its server
  // snapshot is null, so hydration matches the server render and the system
  // theme applies right after (the inline script in root.tsx covers the gap).
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    () => null
  );
  const theme = storedTheme ?? systemTheme;
  const [preference, setPreference] = useState<Preference | null>(() => {
    if (isValidPreference(specifiedPreference)) return specifiedPreference;

    return DEFAULT_PREFERENCE;
  });

  const persistTheme = useFetcher();
  const persistThemeRef = useRef(persistTheme);
  useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLightMQ);

    const handleChange = () => {
      if (preference !== Preference.SYSTEM) return;

      const newTheme = mediaQuery.matches ? Theme.LIGHT : Theme.DARK;
      setThemeState(newTheme);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [preference]);

  const setTheme = useCallback(
    (newTheme: Theme, newPreference: Preference = Preference.SYSTEM) => {
      persistThemeRef.current.submit(
        { theme: newTheme, preference: newPreference },
        { action: "action/set-theme", method: "post" }
      );
      setThemeState(newTheme);
      setPreference(newPreference);
    },
    []
  );

  const value = {
    theme,
    preference,
    setTheme,
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

interface ThemeProviderProps {
  children: JSX.Element;
  specifiedTheme: Theme | undefined;
  specifiedPreference: Preference | undefined;
}

export const useTheme = () => {
  const themeContext = useContext(ThemeContext);
  if (themeContext === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return themeContext;
};

export const isValidTheme = (theme: unknown): theme is Theme => {
  return themes.includes(theme as Theme);
};

export const isValidPreference = (
  preference: unknown
): preference is Preference => {
  return preferences.includes(preference as Preference);
};
