const APP_NAME = "Jira Clone";

export const Footer = (): JSX.Element => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-full items-center justify-center border-t border-border bg-elevation-surface-raised px-5 py-3">
      <p className="text-sm text-font-subtle">
        © {year} {APP_NAME}
      </p>
    </footer>
  );
};
