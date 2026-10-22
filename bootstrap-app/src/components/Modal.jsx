import Button from "./Button.jsx";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={onClose}>Save</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
