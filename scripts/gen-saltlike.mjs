// Salt-like load: N tiny modules in a binary import tree, loaded before hydration,
// behind a "Loading dashboard" splash that clears once the app hydrates.
import fs from "node:fs";
const N = 2400;
const dir = "src/app/saltlike";
fs.mkdirSync(dir, { recursive: true });
for (let i = 0; i < N; i++) {
  const kids = [2 * i + 1, 2 * i + 2].filter((k) => k < N);
  const imports = kids.map((k) => `import { v${k} } from "./m${k}";`).join("\n");
  const sum = kids.length ? kids.map((k) => `v${k}`).join(" + ") + " + 1" : "1";
  fs.writeFileSync(`${dir}/m${i}.ts`, `${imports}\nexport const v${i}: number = ${sum};\n`);
}
fs.writeFileSync(
  "src/app/saltlike/SaltSplash.tsx",
  `import { useEffect, useState } from "react";
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
`,
);
console.log(`wrote ${N} modules`);
