import cx from "classix";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
  Theme,
  Preference,
  useTheme,
  getSystemTheme,
} from "@app/store/theme.store";

export const DarkModeToggle = (): JSX.Element => {
  const { theme, preference, setTheme } = useTheme();

  const effectiveTheme =
    preference === Preference.SYSTEM
      ? typeof window !== "undefined"
        ? getSystemTheme()
        : theme
      : theme;

  const isDark = effectiveTheme === Theme.DARK;

  const handleToggle = (): void => {
    if (isDark) {
      setTheme(Theme.LIGHT, Preference.SELECTED);
      return;
    }
    setTheme(Theme.DARK, Preference.SELECTED);
  };

  return (
    <div className="flex items-center justify-between gap-6 rounded-md bg-elevation-surface-raised p-4 shadow-sm">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cx(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            isDark
              ? "bg-background-neutral text-icon"
              : "bg-background-brand-subtlest text-icon-brand"
          )}
          aria-hidden
        >
          {isDark ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
        </span>
        <div className="min-w-0">
          <p className="font-primary-bold text-sm text-font">Dark mode</p>
          <p className="mt-1 font-primary-light text-sm text-font-subtle">
            {isDark
              ? "Dark theme is on. Switch off for a light workspace."
              : "Light theme is on. Switch on for a darker workspace."}
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        onClick={handleToggle}
        className={cx(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand",
          isDark
            ? "bg-background-brand-bold"
            : "bg-background-neutral-bold"
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 h-6 w-6 rounded-full bg-elevation-surface shadow-sm transition-transform duration-200",
            isDark ? "left-0.5 translate-x-5" : "left-0.5 translate-x-0"
          )}
        />
      </button>
    </div>
  );
};
