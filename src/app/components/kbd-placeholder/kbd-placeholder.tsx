export const Kbd = ({ children }: Props): JSX.Element => {
  return (
    <kbd className="rounded bg-background-neutral p-1 font-primary-light text-icon">
      {children}
    </kbd>
  );
};

interface Props {
  children: string;
}
