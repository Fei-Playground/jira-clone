export const Footer = (): JSX.Element => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-elevation-surface-raised px-5 py-3">
      <p className="text-center font-primary-light text-2xs text-font-subtlest">
        © {year} Jira Clone. All rights reserved.
      </p>
    </footer>
  );
};
