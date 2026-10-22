export default function Button({ variant = "primary", size, children = "Button", ...rest }) {
  const cls = ["btn", `btn-${variant}`, size ? `btn-${size}` : ""].join(" ").trim();
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
