// Says which repository answered, so a call that reaches the wrong one shows it.
// /api/db checks the compose Postgres (DB_PORT, 5433), which runs in the sandbox.
import http from "node:http";
import net from "node:net";
const port = Number(process.env.API_PORT || 8000);
const dbPort = Number(process.env.DB_PORT || 5433);
const name = "island-fixture-jira-clone";
http
  .createServer((req, res) => {
    res.setHeader("content-type", "text/plain");
    if (req.url.startsWith("/api/db")) {
      const s = net.connect(dbPort, "127.0.0.1");
      s.once("connect", () => { s.end(); res.end(`${name}: postgres reachable on ${dbPort}`); });
      s.once("error", (e) => res.end(`${name}: postgres NOT reachable on ${dbPort}: ${e.code}`));
      return;
    }
    res.end(`${name} api on ${port} (${req.url})`);
  })
  .listen(port, "127.0.0.1", () => console.log(`api on ${port}`));
