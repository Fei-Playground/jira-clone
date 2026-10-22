import { useState } from "react";
import Badge from "./components/Badge.jsx";
import Button from "./components/Button.jsx";
import Card from "./components/Card.jsx";
import Modal from "./components/Modal.jsx";

const ORDERS = [
  { id: "A-1001", customer: "Northwind", total: "$1,240.00", status: "Paid" },
  { id: "A-1002", customer: "Contoso", total: "$310.50", status: "Pending" },
  { id: "A-1003", customer: "Fabrikam", total: "$88.00", status: "Refunded" },
];
const TONE = { Paid: "success", Pending: "warning", Refunded: "secondary" };

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Orders</h1>
        <Button onClick={() => setOpen(true)}>New order</Button>
      </div>
      <div className="row g-3">
        {ORDERS.map((o) => (
          <div className="col-md-4" key={o.id}>
            <Card
              title={o.customer}
              footer={<Badge tone={TONE[o.status]}>{o.status}</Badge>}
            >
              <p className="card-text text-muted mb-1">{o.id}</p>
              <p className="card-text order-total">{o.total}</p>
            </Card>
          </div>
        ))}
      </div>
      <Modal open={open} title="New order" onClose={() => setOpen(false)}>
        <input className="form-control" placeholder="Customer" />
      </Modal>
    </div>
  );
}
