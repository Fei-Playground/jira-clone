import { useState } from "react";

/* ============================================================
   Internal Ops Dashboard — Baraka Dates Co. + NutriDate
   Neutral professional UI (Tailwind slate/gray/zinc only)
   ============================================================ */

type Brand = "Baraka" | "NutriDate";
type Platform = "Instagram" | "Email" | "WhatsApp" | "Facebook";
type ContentStatus = "Drafted" | "Pending" | "Scheduled" | "Published";
type AlertLevel = "OK" | "Low" | "Critical";

interface KpiCard {
  label: string;
  barakaValue: string;
  nutriValue: string;
  barakaDelta: string;
  nutriDelta: string;
  icon: string;
}

interface CalendarEntry {
  date: string;
  brand: Brand;
  platform: Platform;
  type: string;
  status: ContentStatus;
  comment?: string;
  mentions?: string[];
}

interface InventoryRow {
  sku: string;
  product: string;
  brand: Brand;
  stock: number;
  velocity: number;
  daysLeft: number;
  alert: AlertLevel;
}

const kpiCards: KpiCard[] = [
  {
    label: "Weekly Traffic",
    barakaValue: "4,821",
    nutriValue: "3,107",
    barakaDelta: "+12%",
    nutriDelta: "+7%",
    icon: "📈",
  },
  {
    label: "Conversion Rate",
    barakaValue: "2.4%",
    nutriValue: "3.1%",
    barakaDelta: "+0.3%",
    nutriDelta: "-0.2%",
    icon: "🛒",
  },
  {
    label: "Email Open Rate",
    barakaValue: "34.8%",
    nutriValue: "28.2%",
    barakaDelta: "+4.1%",
    nutriDelta: "+1.6%",
    icon: "✉️",
  },
  {
    label: "Cart Abandonment",
    barakaValue: "61%",
    nutriValue: "54%",
    barakaDelta: "-3%",
    nutriDelta: "-5%",
    icon: "⚠️",
  },
];

const calendarEntries: CalendarEntry[] = [
  {
    date: "14 Jul",
    brand: "Baraka",
    platform: "Instagram",
    type: "Product Feature — Royal Medjool",
    status: "Scheduled",
    comment: "Hero image approved. Caption needs final sign-off.",
    mentions: ["@sara", "@design"],
  },
  {
    date: "14 Jul",
    brand: "NutriDate",
    platform: "Email",
    type: "Newsletter — July Nutrition Tips",
    status: "Drafted",
    comment: "Subject line variants ready for A/B test.",
    mentions: ["@riya"],
  },
  {
    date: "15 Jul",
    brand: "Baraka",
    platform: "WhatsApp",
    type: "Broadcast — Eid early-bird offer",
    status: "Pending",
    comment: "Awaiting halal cert copy verification before publish.",
    mentions: ["@ops", "@legal"],
  },
  {
    date: "16 Jul",
    brand: "NutriDate",
    platform: "Instagram",
    type: "Reel — Performance Pack workout",
    status: "Drafted",
    comment: "Video edit in progress.",
    mentions: ["@amir"],
  },
  {
    date: "17 Jul",
    brand: "Baraka",
    platform: "Email",
    type: "Campaign — Gift collections launch",
    status: "Pending",
    comment: "Segment list needs review — check exclusions.",
    mentions: ["@sara", "@riya"],
  },
  {
    date: "18 Jul",
    brand: "NutriDate",
    platform: "Instagram",
    type: "Nutrition fact carousel — Fiber",
    status: "Scheduled",
    comment: "USDA source linked in brief. Ready to go.",
    mentions: ["@design"],
  },
  {
    date: "20 Jul",
    brand: "Baraka",
    platform: "Facebook",
    type: "Ad copy test A/B — Hero banner",
    status: "Drafted",
    comment: "Variant B needs budget approval before launch.",
    mentions: ["@ops"],
  },
  {
    date: "21 Jul",
    brand: "NutriDate",
    platform: "WhatsApp",
    type: "Broadcast — Trial Box flash sale",
    status: "Pending",
    comment: "Flash sale window confirmed: 6–9 PM IST.",
    mentions: ["@amir", "@riya"],
  },
];

const inventoryRows: InventoryRow[] = [
  {
    sku: "BRK-MED-500",
    product: "Royal Medjool 500g",
    brand: "Baraka",
    stock: 840,
    velocity: 42,
    daysLeft: 20,
    alert: "OK",
  },
  {
    sku: "BRK-RAM-1KG",
    product: "Ramadan Special Box 1kg",
    brand: "Baraka",
    stock: 110,
    velocity: 18,
    daysLeft: 6,
    alert: "Low",
  },
  {
    sku: "BRK-EID-750",
    product: "Eid Gift Collection 750g",
    brand: "Baraka",
    stock: 25,
    velocity: 12,
    daysLeft: 2,
    alert: "Critical",
  },
  {
    sku: "ND-CLS-500",
    product: "Classic Medjool 500g",
    brand: "NutriDate",
    stock: 1200,
    velocity: 60,
    daysLeft: 20,
    alert: "OK",
  },
  {
    sku: "ND-PERF-1KG",
    product: "Performance Pack 1kg",
    brand: "NutriDate",
    stock: 200,
    velocity: 35,
    daysLeft: 5,
    alert: "Low",
  },
  {
    sku: "ND-TRL-250",
    product: "Trial Box 250g",
    brand: "NutriDate",
    stock: 620,
    velocity: 28,
    daysLeft: 22,
    alert: "OK",
  },
];

/* ── Helpers ─────────────────────────────────────────────── */

function BrandBadge({ brand }: { brand: Brand }) {
  const isBaraka = brand === "Baraka";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        background: isBaraka ? "#d1fae5" : "#fef3c7",
        color: isBaraka ? "#065f46" : "#92400e",
      }}
    >
      {isBaraka ? "🌙" : "◈"} {brand}
    </span>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const map: Record<ContentStatus, { bg: string; text: string }> = {
    Scheduled: { bg: "#dbeafe", text: "#1e40af" },
    Drafted: { bg: "#e5e7eb", text: "#374151" },
    Pending: { bg: "#fef9c3", text: "#854d0e" },
    Published: { bg: "#dcfce7", text: "#166534" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

function AlertBadge({ level }: { level: AlertLevel }) {
  const map: Record<
    AlertLevel,
    { bg: string; text: string; dot: string; label: string }
  > = {
    OK: { bg: "#dcfce7", text: "#166534", dot: "#16a34a", label: "OK" },
    Low: { bg: "#fef9c3", text: "#854d0e", dot: "#ca8a04", label: "Low Stock" },
    Critical: {
      bg: "#fee2e2",
      text: "#991b1b",
      dot: "#dc2626",
      label: "Critical",
    },
  };
  const s = map[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.text }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
}

function PlatformIcon({ platform }: { platform: Platform }) {
  const icons: Record<Platform, string> = {
    Instagram: "📷",
    Email: "✉️",
    WhatsApp: "💬",
    Facebook: "👥",
  };
  return (
    <span className="text-slate-600 inline-flex items-center gap-1 text-sm">
      <span>{icons[platform]}</span>
      <span className="text-xs">{platform}</span>
    </span>
  );
}

function DeltaTag({ value }: { value: string }) {
  const isPositive = value.startsWith("+");
  const isNeg = value.startsWith("-");
  // For abandonment, lower is better — but we keep it simple here
  return (
    <span
      className="text-xs font-medium"
      style={{ color: isPositive ? "#16a34a" : isNeg ? "#dc2626" : "#6b7280" }}
    >
      {value}
    </span>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export function OpsDashboard() {
  const [dark, setDark] = useState(false);

  const D = {
    bg: dark ? "rgb(15 23 42)" : "rgb(248 250 252)", // slate-900 / slate-50
    card: dark ? "rgb(30 41 59)" : "rgb(255 255 255)", // slate-800 / white
    cardBorder: dark ? "rgb(51 65 85)" : "rgb(226 232 240)", // slate-700 / slate-200
    headerBg: dark ? "rgb(15 23 42)" : "rgb(255 255 255)",
    headerBorder: dark ? "rgb(51 65 85)" : "rgb(226 232 240)",
    text: dark ? "rgb(241 245 249)" : "rgb(15 23 42)", // slate-100 / slate-900
    textMuted: dark ? "rgb(148 163 184)" : "rgb(100 116 139)", // slate-400
    textSubtle: dark ? "rgb(100 116 139)" : "rgb(71 85 105)", // slate-500
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="font-sans min-h-screen"
      style={{ background: D.bg, color: D.text }}
    >
      {/* ── HEADER ──────────────────────────────────────── */}
      <header
        className="border-b px-4 py-4 sm:px-8"
        style={{ background: D.headerBg, borderColor: D.headerBorder }}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-slate-900 text-xl font-bold">
              🗂 Operations Dashboard
            </h1>
            <p className="text-slate-400 text-xs" suppressHydrationWarning>
              {today}
            </p>
          </div>

          {/* Brand pills */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Active Brands:
            </span>
            <div className="border-emerald-200 bg-emerald-50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <span style={{ color: "#0F3D2E", fontSize: "0.95rem" }}>☽</span>
              <span
                className="text-xs font-semibold"
                style={{ color: "#0F3D2E" }}
              >
                Baraka Dates Co.
              </span>
            </div>
            <div className="border-amber-200 bg-amber-50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <span style={{ color: "#3D4A34", fontSize: "0.85rem" }}>◈</span>
              <span
                className="text-xs font-semibold"
                style={{ color: "#3D4A34" }}
              >
                NutriDate
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-slate-400 flex items-center gap-2 text-xs">
              <span className="bg-green-400 inline-block h-2 w-2 rounded-full" />
              All systems operational
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                background: dark ? "rgb(51 65 85)" : "rgb(241 245 249)",
                border: `1px solid ${dark ? "rgb(71 85 105)" : "rgb(203 213 225)"}`,
                borderRadius: "999px",
                padding: "0.3rem 0.65rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                color: dark ? "rgb(241 245 249)" : "rgb(51 65 85)",
                transition: "all 0.2s",
              }}
            >
              {dark ? "☀️" : "🌙"}
              <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                {dark ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main
        className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-8 sm:py-8"
        style={{ background: D.bg }}
      >
        {/* ── KPI CARDS ───────────────────────────────────── */}
        <section>
          <h2 className="text-slate-500 mb-4 text-sm font-semibold uppercase tracking-wider">
            Weekly KPI Summary
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border p-5 shadow-sm"
                style={{ background: D.card, borderColor: D.cardBorder }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {card.label}
                  </span>
                  <span className="text-base">{card.icon}</span>
                </div>

                {/* Baraka row */}
                <div className="mb-2">
                  <div className="mb-0.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-xs">☽</span>
                      <span className="text-slate-500 text-xs">Baraka</span>
                    </div>
                    <DeltaTag value={card.barakaDelta} />
                  </div>
                  <p className="text-slate-900 text-2xl font-bold">
                    {card.barakaValue}
                  </p>
                </div>

                <div className="bg-slate-100 my-3 h-px" />

                {/* NutriDate row */}
                <div>
                  <div className="mb-0.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-xs">◈</span>
                      <span className="text-slate-500 text-xs">NutriDate</span>
                    </div>
                    <DeltaTag value={card.nutriDelta} />
                  </div>
                  <p className="text-slate-800 text-2xl font-bold">
                    {card.nutriValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTENT CALENDAR ────────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
              📅 Content Calendar — Next 2 Weeks
            </h2>
            <span className="bg-slate-100 text-slate-500 rounded-full px-3 py-1 text-xs font-medium">
              {calendarEntries.length} items queued
            </span>
          </div>

          <div
            className="overflow-x-auto rounded-xl border shadow-sm"
            style={{ background: D.card, borderColor: D.cardBorder }}
          >
            <table
              className="w-full min-w-[700px] text-sm"
              style={{ background: D.card }}
            >
              <thead>
                <tr className="border-slate-200 bg-slate-50 border-b">
                  {[
                    "Date",
                    "Brand",
                    "Platform",
                    "Content",
                    "Comment & Mentions",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-slate-400 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calendarEntries.map((entry, i) => (
                  <tr
                    key={i}
                    className="border-slate-100 hover:bg-slate-50 border-b last:border-0"
                  >
                    <td className="text-slate-600 px-4 py-3 text-xs font-medium">
                      {entry.date}
                    </td>
                    <td className="px-4 py-3">
                      <BrandBadge brand={entry.brand} />
                    </td>
                    <td className="px-4 py-3">
                      <PlatformIcon platform={entry.platform} />
                    </td>
                    <td className="text-slate-700 max-w-xs px-4 py-3 text-sm">
                      {entry.type}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ minWidth: "200px", maxWidth: "260px" }}
                    >
                      {entry.comment && (
                        <p className="text-slate-500 mb-1.5 text-xs leading-snug">
                          {entry.comment}
                        </p>
                      )}
                      {entry.mentions && entry.mentions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.mentions.map((mention) => (
                            <span
                              key={mention}
                              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                              style={{
                                background: "#ede9fe",
                                color: "#6d28d9",
                              }}
                            >
                              {mention}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={entry.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── INVENTORY ALERTS ────────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
              📦 Inventory Alerts
            </h2>
            <div className="text-slate-500 flex items-center gap-2 text-xs">
              <span className="bg-red-100 text-red-700 inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium">
                <span className="bg-red-600 inline-block h-1.5 w-1.5 rounded-full" />
                {inventoryRows.filter((r) => r.alert === "Critical").length}{" "}
                Critical
              </span>
              <span className="bg-yellow-100 text-yellow-700 inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium">
                <span className="bg-yellow-500 inline-block h-1.5 w-1.5 rounded-full" />
                {inventoryRows.filter((r) => r.alert === "Low").length} Low
                Stock
              </span>
            </div>
          </div>

          <div
            className="overflow-x-auto rounded-xl border shadow-sm"
            style={{ background: D.card, borderColor: D.cardBorder }}
          >
            <table
              className="w-full min-w-[640px] text-sm"
              style={{ background: D.card }}
            >
              <thead>
                <tr className="border-slate-200 bg-slate-50 border-b">
                  {[
                    "SKU",
                    "Product",
                    "Brand",
                    "Stock (units)",
                    "Velocity/day",
                    "Days Left",
                    "Alert",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-slate-400 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventoryRows.map((row) => (
                  <tr
                    key={row.sku}
                    className="border-slate-100 hover:bg-slate-50 border-b last:border-0"
                    style={
                      row.alert === "Critical"
                        ? { background: "#fff5f5" }
                        : row.alert === "Low"
                          ? { background: "#fffbeb" }
                          : undefined
                    }
                  >
                    <td className="font-mono text-slate-500 px-4 py-3 text-xs">
                      {row.sku}
                    </td>
                    <td className="text-slate-800 px-4 py-3 font-medium">
                      {row.product}
                    </td>
                    <td className="px-4 py-3">
                      <BrandBadge brand={row.brand} />
                    </td>
                    <td className="text-slate-900 px-4 py-3 font-semibold">
                      {row.stock.toLocaleString()}
                    </td>
                    <td className="text-slate-600 px-4 py-3">{row.velocity}</td>
                    <td
                      className="px-4 py-3 font-semibold"
                      style={{
                        color:
                          row.daysLeft <= 3
                            ? "#dc2626"
                            : row.daysLeft <= 7
                              ? "#ca8a04"
                              : "#16a34a",
                      }}
                    >
                      {row.daysLeft}d
                    </td>
                    <td className="px-4 py-3">
                      <AlertBadge level={row.alert} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 mt-3 text-xs">
            ⚠️ Reorder recommendations flagged above are for review only. No
            supplier orders will be placed without explicit approval.
          </p>
        </section>

        {/* ── QUICK ACTIONS ───────────────────────────────── */}
        <section>
          <h2 className="text-slate-500 mb-4 text-sm font-semibold uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              {
                label: "📝 Review Drafted Content",
                color: "bg-blue-50 text-blue-700 border-blue-200",
              },
              {
                label: "📊 View Full Analytics",
                color: "bg-slate-50 text-slate-700 border-slate-200",
              },
              {
                label: "🔔 Flag Inventory Alert",
                color: "bg-amber-50 text-amber-700 border-amber-200",
              },
              {
                label: "📮 Approve Email Queue",
                color: "bg-green-50 text-green-700 border-green-200",
              },
              {
                label: "📅 Add Content Item",
                color: "bg-purple-50 text-purple-700 border-purple-200",
              },
            ].map((action) => (
              <button
                key={action.label}
                className={`rounded-lg border px-4 py-2.5 text-xs font-semibold transition-opacity hover:opacity-80 ${action.color}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer
        className="mt-8 border-t px-4 py-4 sm:px-8"
        style={{ background: D.headerBg, borderColor: D.headerBorder }}
      >
        <p className="text-slate-400 text-center text-xs">
          Internal Use Only · Baraka Dates Co. + NutriDate Operations ·
          Auto-refreshes weekly
        </p>
      </footer>
    </div>
  );
}

export default OpsDashboard;
