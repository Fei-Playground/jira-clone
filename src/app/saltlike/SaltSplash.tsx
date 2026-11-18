import { useEffect, useState } from "react";
import { v0 } from "./m0";

/** Covers the page until the client has loaded every module and hydrated. */
export function SaltSplash() {
  const [active, setActive] = useState(true);
  useEffect(() => setActive(false), []);
  return (
    <div
      id="salt-splash"
      data-modules={v0}
      className={active ? "salt-splash-active" : ""}
      style={{
        display: active ? "flex" : "none",
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        alignItems: "center",
        justifyContent: "center",
        background: "#1b1b1b",
        color: "#8b7cf6",
        font: "600 20px system-ui",
      }}
    >
      Loading dashboard
    </div>
  );
}
