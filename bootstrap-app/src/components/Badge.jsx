export default function Badge({ tone = "secondary", children }) {
  return <span className={`badge text-bg-${tone}`}>{children}</span>;
}
