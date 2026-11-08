import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { Badge } from "./Badge";

function App() {
  const [api, setApi] = useState("…");
  useEffect(() => {
    fetch("/api/whoami").then((r) => r.text()).then(setApi, (e) => setApi(`error: ${e}`));
  }, []);
  return (
    <>
      <Badge label="island-fixture-jira-clone APP" />
      <p id="api">API says: {api}</p>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
