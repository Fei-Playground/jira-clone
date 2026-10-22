export default function Card({ title, children, footer }) {
  return (
    <div className="card">
      <div className="card-body">
        {title && <h5 className="card-title">{title}</h5>}
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
