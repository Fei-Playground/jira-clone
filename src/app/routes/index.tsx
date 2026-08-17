/* ============================================================
   Brand Hub — Home page for Baraka Dates Co. + NutriDate
   Neutral clean design, links to all three brand pages.
   ============================================================ */
import { Link } from "react-router";

const brands = [
  {
    slug: "/baraka",
    name: "Baraka Dates Co.",
    tagline: "Premium Muslim festival & gifting dates",
    desc: "A reverent, luxury brand for Ramadan, Eid, and every blessed occasion. Beautifully packaged Medjool dates, sourced with care.",
    icon: "☽",
    accent: "#C9A227",
    bg: "#0F3D2E",
    textColor: "#F7F1E3",
    badgeBg: "rgba(201,162,39,0.15)",
    badgeText: "#C9A227",
    label: "Visit Baraka",
    nameFont: "'Cormorant Garamond', Georgia, serif",
    nameFontSize: "1.3rem",
  },
  {
    slug: "/nutridate",
    name: "NutriDate",
    tagline: "Health-first dates. No hype.",
    desc: "A clean, evidence-based wellness brand. Premium Medjool dates with transparent nutrition facts, zero additives, and honest pricing.",
    icon: "◈",
    accent: "#D98E2B",
    bg: "#3D4A34",
    textColor: "#F6F4EE",
    badgeBg: "rgba(217,142,43,0.15)",
    badgeText: "#D98E2B",
    label: "Visit NutriDate",
    nameFont: "'Space Grotesk', system-ui, sans-serif",
    nameFontSize: "1.15rem",
  },
  {
    slug: "/ops-dashboard",
    name: "Ops Dashboard",
    tagline: "Internal operations tool",
    desc: "Weekly KPI summary, 14-day content calendar with @mention threads, inventory alerts with reorder flags — both brands in one view.",
    icon: "🗂",
    accent: "#64748b",
    bg: "#1e293b",
    textColor: "#f1f5f9",
    badgeBg: "rgba(100,116,139,0.12)",
    badgeText: "#64748b",
    label: "Open Dashboard",
    nameFont: "system-ui, sans-serif",
    nameFontSize: "1.15rem",
  },
];

export default function IndexRoute() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Space+Grotesk:wght@600;700&display=swap');
      `}</style>

      {/* ── HEADER ── */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: "0.1rem",
            }}
          >
            Brand Hub
          </p>
          <h1
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Dates Business Suite
          </h1>
        </div>
        <span
          style={{
            fontSize: "0.7rem",
            color: "#9ca3af",
            background: "#f3f4f6",
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
          }}
        >
          2 brands · 1 dashboard
        </span>
      </header>

      {/* ── HERO AREA ── */}
      <div
        style={{
          padding: "3rem 2rem 1.5rem",
          textAlign: "center",
          maxWidth: "640px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.2,
            margin: "0 0 0.75rem",
          }}
        >
          Welcome back.
        </h2>
        <p style={{ color: "#6b7280", fontSize: "1rem", margin: 0 }}>
          Choose a brand site to visit, or open the ops dashboard.
        </p>
      </div>

      {/* ── BRAND CARDS ── */}
      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          padding: "1.5rem 2rem 3rem",
          maxWidth: "1080px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            to={brand.slug}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                transition: "transform 0.18s, box-shadow 0.18s",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 12px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "none";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 1px 4px rgba(0,0,0,0.06)";
              }}
            >
              {/* Card header stripe */}
              <div
                style={{
                  background: brand.bg,
                  padding: "1.75rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1.8rem",
                    width: "3rem",
                    height: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: brand.badgeBg,
                    borderRadius: "10px",
                    flexShrink: 0,
                  }}
                >
                  {brand.icon}
                </span>
                <div>
                  <p
                    style={{
                      color: brand.accent,
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      margin: "0 0 0.2rem",
                    }}
                  >
                    {brand.tagline}
                  </p>
                  <h3
                    style={{
                      color: brand.textColor,
                      fontSize: brand.nameFontSize,
                      fontWeight: 700,
                      fontFamily: brand.nameFont,
                      margin: 0,
                      letterSpacing: brand.nameFont?.includes("Cormorant")
                        ? "0.01em"
                        : undefined,
                    }}
                  >
                    {brand.name}
                  </h3>
                </div>
              </div>

              {/* Card body */}
              <div
                style={{
                  padding: "1.25rem 1.5rem 1.5rem",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    lineHeight: "1.6",
                    flex: 1,
                    margin: "0 0 1.25rem",
                  }}
                >
                  {brand.desc}
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: brand.accent,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  {brand.label} →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "1rem 2rem",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "0.75rem",
          background: "#fff",
        }}
      >
        Dates Business Suite · Internal · 2025
      </footer>
    </div>
  );
}
