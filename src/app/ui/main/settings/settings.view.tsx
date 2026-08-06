import { DarkModeToggle } from "./dark-mode-toggle";

export const SettingsView = (): JSX.Element => {
  return (
    <div className="mx-auto w-full max-w-[720px] p-6">
      <header className="mb-8">
        <h1 className="font-primary-black text-2xl text-font">SETTINGS</h1>
        <p className="mt-2 font-primary-light text-sm text-font-subtle">
          Manage your workspace preferences.
        </p>
      </header>

      <section aria-labelledby="appearance-heading">
        <h2
          id="appearance-heading"
          className="mb-3 font-primary-bold text-lg text-font"
        >
          Appearance
        </h2>
        <DarkModeToggle />
      </section>
    </div>
  );
};
