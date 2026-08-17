/* ============================================================
   Baraka Dates Co. — Brand Homepage
   Palette: Emerald #0F3D2E | Gold #C9A227 | Cream #F7F1E3 | Maroon #7A1F2B
   Fonts: Cormorant Garamond (display) | Poppins (body)
   ============================================================ */
import React, { useState, useEffect } from "react";

const B = {
  emerald: "#0F3D2E",
  gold: "#C9A227",
  goldLight: "#E5C668",
  cream: "#F7F1E3",
  creamDark: "#EDE4CE",
  maroon: "#7A1F2B",
  maroonDark: "#5C1620",
  white: "#FFFFFF",
};

const products = [
  {
    id: 1,
    name: "Royal Medjool Dates",
    weight: "500g",
    price: "₹749",
    desc: "Hand-picked, Grade A Medjool dates. Plump, caramel-rich, and utterly indulgent.",
    emoji: "🌟",
    imageUrl: null as string | null,
  },
  {
    id: 2,
    name: "Ramadan Special Box",
    weight: "1kg",
    price: "₹1,299",
    desc: "A curated selection of premium dates with saffron-rose water infusion, gifted in a keepsake box.",
    emoji: "🌙",
    imageUrl: null as string | null,
  },
  {
    id: 3,
    name: "Eid Gift Collection",
    weight: "750g",
    price: "₹1,099",
    desc: "Celebratory assortment with three date varieties, wrapped in hand-stamped emerald cloth.",
    emoji: "⭐",
    imageUrl: null as string | null,
  },
];

const giftCollections = [
  {
    id: 1,
    title: "Ramadan Hamper",
    icon: "🌙",
    desc: "A month of blessings in every bite. Our Ramadan hamper is thoughtfully curated for the blessed nights ahead.",
  },
  {
    id: 2,
    title: "Eid Gift Box",
    icon: "🎁",
    desc: "Mark Eid with something truly special. Elegant packaging, premium dates, a gift that honours the occasion.",
  },
  {
    id: 3,
    title: "Corporate Gifting",
    icon: "✨",
    desc: "Gift meaningfully this festive season. Bulk orders welcome. Custom branding available for your organisation.",
  },
];

const GoldDivider = () => (
  <div className="flex items-center gap-4 py-2">
    <div className="h-px flex-1" style={{ background: B.gold, opacity: 0.4 }} />
    <span style={{ color: B.gold, fontSize: "1.1rem" }}>❖</span>
    <div className="h-px flex-1" style={{ background: B.gold, opacity: 0.4 }} />
  </div>
);

function calcRemaining(targetMs: number) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  };
}

function useCountdown(targetMs: number) {
  const [time, setTime] = useState(() => calcRemaining(targetMs));
  useEffect(() => {
    const id = setInterval(() => setTime(calcRemaining(targetMs)), 30_000);
    return () => clearInterval(id);
  }, [targetMs]);
  return time;
}

function PersonaliseTiles() {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({
    "message-card": false,
    "ribbon-colour": false,
    candle: false,
  });

  const options = [
    {
      id: "message-card",
      icon: "💌",
      label: "Add a Message Card",
      sub: "Handwritten by our team",
    },
    {
      id: "ribbon-colour",
      icon: "🎀",
      label: "Custom Ribbon Colour",
      sub: "Emerald, gold, or maroon",
    },
    {
      id: "candle",
      icon: "🕯",
      label: "Include a Candle",
      sub: "Oud or rose-amber scent",
    },
  ];

  const toggle = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {options.map((opt) => {
        const on = selected[opt.id];
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className="baraka-body text-left transition-all"
            style={{
              background: on ? B.maroon : B.white,
              border: `1.5px solid ${on ? B.maroon : B.creamDark}`,
              padding: "1.25rem 1.5rem",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span style={{ fontSize: "1.6rem" }}>{opt.icon}</span>
              {/* Checkbox */}
              <span
                style={{
                  width: "1.1rem",
                  height: "1.1rem",
                  borderRadius: "3px",
                  border: `1.5px solid ${on ? B.gold : B.creamDark}`,
                  background: on ? B.gold : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {on && (
                  <span
                    style={{
                      color: B.emerald,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                )}
              </span>
            </div>
            <h3
              className="baraka-display mb-1"
              style={{
                color: on ? B.gold : B.emerald,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              {opt.label}
            </h3>
            <p
              className="baraka-body"
              style={{
                color: on ? B.cream : "#777",
                fontSize: "0.78rem",
                fontWeight: 300,
              }}
            >
              {opt.sub}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export function BarakaHome() {
  // Ramadan 2027 — Jan 29 2027 00:00 IST (1st Ramadan 1448 AH, estimated)
  const RAMADAN_TARGET_MS = 1801161000000;
  const ramadanCountdown = useCountdown(RAMADAN_TARGET_MS);
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600&display=swap');
        .baraka-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .baraka-body { font-family: 'Poppins', system-ui, sans-serif; }
        .baraka-btn-gold {
          background: ${B.gold};
          color: ${B.emerald};
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.75rem 2rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .baraka-btn-gold:hover { background: ${B.goldLight}; }
        .baraka-btn-outline {
          background: transparent;
          color: ${B.gold};
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.73rem 2rem;
          border: 1.5px solid ${B.gold};
          cursor: pointer;
          transition: all 0.2s;
        }
        .baraka-btn-outline:hover { background: rgba(201,162,39,0.1); }
        .baraka-card { transition: transform 0.2s, box-shadow 0.2s; }
        .baraka-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(15,61,46,0.15); }
        .baraka-collection-tile { transition: all 0.2s; cursor: pointer; }
        .baraka-collection-tile:hover { background: ${B.maroonDark} !important; }
        .baraka-wa-btn:hover .baraka-wa-tooltip { opacity: 1 !important; }
      `}</style>

      <div className="baraka-body" style={{ background: B.cream, minWidth: 0 }}>
        {/* ── NAV ─────────────────────────────────────────── */}
        <nav
          className="flex items-center justify-between px-4 py-4 sm:px-8"
          style={{ background: B.emerald }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: B.gold, fontSize: "1.4rem" }}>☽</span>
            <span
              className="baraka-display"
              style={{
                color: B.cream,
                fontSize: "1.5rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Baraka Dates Co.
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {["Shop", "Gift Collections", "Our Story", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  className="baraka-body"
                  style={{
                    background: "none",
                    border: "none",
                    color: B.cream,
                    fontSize: "0.82rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    opacity: 0.85,
                  }}
                >
                  {item}
                </button>
              )
            )}
          </div>
          <div className="flex items-center gap-4">
            <span
              style={{ color: B.gold, fontSize: "1.2rem", cursor: "pointer" }}
            >
              🛍
            </span>
            <span style={{ color: B.cream, fontSize: "0.75rem", opacity: 0.7 }}>
              0 items
            </span>
          </div>
        </nav>

        {/* ── HERO ────────────────────────────────────────── */}
        <section
          className="relative flex min-h-[580px] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
          style={{ background: B.emerald }}
        >
          {/* Decorative radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 60%, rgba(201,162,39,0.12) 0%, transparent 70%)`,
            }}
          />
          {/* Gold crescent accent */}
          <div
            style={{
              color: B.gold,
              fontSize: "2.5rem",
              marginBottom: "0.5rem",
              opacity: 0.9,
            }}
          >
            ☽ ✦ ☾
          </div>

          <p
            className="baraka-body mb-3 uppercase tracking-widest"
            style={{
              color: B.gold,
              fontSize: "0.78rem",
              letterSpacing: "0.22em",
            }}
          >
            Premium Medjool Dates · Est. 2020 · India
          </p>

          <h1
            className="baraka-display relative z-10 mb-6 leading-tight"
            style={{
              color: B.cream,
              fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
              fontWeight: 600,
              maxWidth: "700px",
            }}
          >
            Gift the Finest
            <br />
            <em style={{ color: B.gold }}>Medjool Dates</em>
          </h1>

          <p
            className="baraka-body relative z-10 mb-10 max-w-lg leading-relaxed"
            style={{
              color: B.cream,
              fontSize: "1rem",
              opacity: 0.85,
              fontWeight: 300,
            }}
          >
            Sourced from sun-blessed groves, curated with reverence, and gifted
            with love. Perfect for Ramadan, Eid, and every blessed occasion.
          </p>

          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <button className="baraka-btn-gold">Shop Gifts</button>
            <button className="baraka-btn-outline">Learn More</button>
          </div>

          {/* Trust badges */}
          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: "☽★", label: "Halal Sourced" },
              { icon: "🛡", label: "Food Safety Certified" },
              { icon: "🌿", label: "Natural · No Additives" },
            ].map((badge) => (
              <span
                key={badge.label}
                className="baraka-body flex items-center gap-1.5"
                style={{
                  background: "rgba(15,61,46,0.55)",
                  border: "1px solid rgba(201,162,39,0.5)",
                  borderRadius: "999px",
                  padding: "0.35rem 0.9rem",
                  color: B.cream,
                  fontSize: "0.72rem",
                  letterSpacing: "0.04em",
                  backdropFilter: "blur(4px)",
                }}
              >
                <span style={{ fontSize: "0.85rem", lineHeight: 1 }}>
                  {badge.icon}
                </span>
                {badge.label}
              </span>
            ))}
          </div>

          {/* Bottom decorative border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)`,
            }}
          />
        </section>

        {/* ── REWARDS BANNER ──────────────────────────────── */}
        <div
          className="flex flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row sm:px-10"
          style={{ background: B.maroonDark }}
        >
          {/* Icon + Text */}
          <div className="flex items-center gap-4">
            <span style={{ color: B.gold, fontSize: "1.6rem", lineHeight: 1 }}>
              ☽★
            </span>
            <div>
              <h3
                className="baraka-display"
                style={{
                  color: B.gold,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Earn Barakah Points with every order
              </h3>
              <p
                className="baraka-body mt-0.5"
                style={{
                  color: B.cream,
                  fontSize: "0.78rem",
                  opacity: 0.8,
                  fontWeight: 300,
                }}
              >
                1 point per ₹10 spent · Redeem for free gifts &amp; upgrades
              </p>
            </div>
          </div>
          {/* CTA */}
          <button
            className="baraka-btn-outline flex-shrink-0"
            style={{
              borderColor: B.gold,
              color: B.gold,
              padding: "0.5rem 1.5rem",
              fontSize: "0.78rem",
            }}
          >
            Join Now
          </button>
        </div>

        {/* ── BRAND PROMISE STRIP ─────────────────────────── */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 px-4 py-5 sm:gap-12 sm:px-8"
          style={{ background: B.creamDark }}
        >
          {[
            { icon: "🌿", label: "Naturally Premium" },
            { icon: "🎁", label: "Luxury Packaging" },
            { icon: "🚚", label: "Pan-India Delivery" },
            { icon: "✅", label: "Halal Sourced" },
          ].map((item) => (
            <div
              key={item.label}
              className="baraka-body flex items-center gap-2"
              style={{
                fontSize: "0.8rem",
                color: B.emerald,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* ── RAMADAN BANNER ──────────────────────────────── */}
        <section
          className="px-4 py-14 text-center sm:px-8"
          style={{ background: B.maroonDark }}
        >
          <div className="mx-auto max-w-2xl">
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>🌙</div>
            <p
              className="baraka-body mb-2 uppercase tracking-widest"
              style={{
                color: B.gold,
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
              }}
            >
              Now Available — Early Bird Offer
            </p>
            <h2
              className="baraka-display mb-4"
              style={{
                color: B.cream,
                fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
                fontWeight: 600,
                lineHeight: 1.25,
              }}
            >
              Ramadan Mubarak &mdash;
              <br />
              <em style={{ color: B.gold }}>Order Your Dates</em>
            </h2>
            {/* Countdown timer */}
            <div
              className="mx-auto mb-8"
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "1.25rem 2rem",
                display: "inline-flex",
                gap: "2rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {(
                [
                  { v: ramadanCountdown.days, l: "Days" },
                  { v: ramadanCountdown.hours, l: "Hours" },
                  { v: ramadanCountdown.minutes, l: "Mins" },
                ] as { v: number; l: string }[]
              ).map((item) => (
                <div
                  key={item.l}
                  style={{ textAlign: "center", minWidth: "3.5rem" }}
                >
                  <p
                    className="baraka-display"
                    style={{
                      color: B.gold,
                      fontSize: "2.4rem",
                      fontWeight: 600,
                      lineHeight: 1,
                      margin: 0,
                    }}
                    suppressHydrationWarning
                  >
                    {String(item.v).padStart(2, "0")}
                  </p>
                  <p
                    className="baraka-body"
                    style={{
                      color: B.cream,
                      opacity: 0.6,
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      margin: "0.25rem 0 0",
                    }}
                  >
                    {item.l}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="baraka-body mb-8 leading-relaxed"
              style={{
                color: B.cream,
                opacity: 0.85,
                fontWeight: 300,
                fontSize: "0.95rem",
              }}
            >
              Reserve your Ramadan gift boxes now and receive complimentary
              premium packaging. Early-bird orders receive free delivery across
              India. Limited quantities available.
            </p>
            <button className="baraka-btn-gold">
              Order Your Ramadan Gift Box
            </button>
          </div>
        </section>

        {/* ── PRESS STRIP ──────────────────────────────────── */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 px-6 py-6 sm:gap-10 sm:px-8"
          style={{
            background: B.cream,
            borderBottom: `1px solid ${B.creamDark}`,
          }}
        >
          <p
            className="baraka-body w-full text-center sm:w-auto"
            style={{
              color: B.gold,
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            As Seen In
          </p>
          {[
            "The Hindu",
            "Femina",
            "Vogue India",
            "Mint",
            "Condé Nast Traveller",
          ].map((pub) => (
            <span
              key={pub}
              className="baraka-display"
              style={{
                color: B.emerald,
                fontSize: "1.05rem",
                fontWeight: 500,
                opacity: 0.55,
                fontStyle: "italic",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {pub}
            </span>
          ))}
        </div>

        {/* ── FEATURED PRODUCTS ───────────────────────────── */}
        <section
          className="px-4 py-16 sm:px-6 sm:py-20"
          style={{ background: B.cream }}
        >
          <div className="mx-auto max-w-5xl">
            {/* Section heading */}
            <div className="mb-12 text-center">
              <p
                className="baraka-body mb-2 uppercase tracking-widest"
                style={{
                  color: B.gold,
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                }}
              >
                Our Signature Range
              </p>
              <h2
                className="baraka-display mb-4"
                style={{
                  color: B.emerald,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 600,
                }}
              >
                Featured Products
              </h2>
              <GoldDivider />
            </div>

            {/* Product cards */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="baraka-card flex flex-col overflow-hidden"
                  style={{
                    background: B.white,
                    border: `1px solid ${B.creamDark}`,
                  }}
                >
                  {/* Product image / placeholder */}
                  <div
                    className="flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${B.maroon}, ${B.maroonDark})`,
                      height: "180px",
                    }}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <span style={{ fontSize: "3rem" }}>
                          {product.emoji}
                        </span>
                        <p
                          className="baraka-display mt-1"
                          style={{
                            color: B.gold,
                            fontSize: "0.9rem",
                            fontStyle: "italic",
                          }}
                        >
                          Medjool Dates
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      className="baraka-display mb-1"
                      style={{
                        color: B.emerald,
                        fontSize: "1.35rem",
                        fontWeight: 600,
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="baraka-body mb-3"
                      style={{
                        color: B.gold,
                        fontSize: "0.78rem",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {product.weight}
                    </p>
                    <p
                      className="baraka-body mb-4 flex-1 leading-relaxed"
                      style={{
                        color: "#555",
                        fontSize: "0.85rem",
                        fontWeight: 300,
                      }}
                    >
                      {product.desc}
                    </p>

                    <div className="flex items-center justify-between">
                      <span
                        className="baraka-display"
                        style={{
                          color: B.emerald,
                          fontSize: "1.4rem",
                          fontWeight: 600,
                        }}
                      >
                        {product.price}
                      </span>
                      <button
                        className="baraka-btn-gold"
                        style={{
                          padding: "0.55rem 1.2rem",
                          fontSize: "0.75rem",
                        }}
                      >
                        Add to Gift Box
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                className="baraka-btn-outline"
                style={{ borderColor: B.emerald, color: B.emerald }}
              >
                View Full Catalogue
              </button>
            </div>
          </div>
        </section>

        {/* ── VIDEO SHOWCASE ──────────────────────────────── */}
        <section
          className="px-4 py-20 sm:px-8 sm:py-28"
          style={{ background: B.emerald }}
        >
          <div className="mx-auto max-w-4xl text-center">
            {/* Eyebrow */}
            <p
              className="baraka-body mb-3 uppercase tracking-widest"
              style={{
                color: B.gold,
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
              }}
            >
              Our Story
            </p>
            {/* Headline */}
            <h2
              className="baraka-display mb-4"
              style={{
                color: B.cream,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              The Story Behind Our Dates
            </h2>
            {/* Subtitle */}
            <p
              className="baraka-body mx-auto mb-12 max-w-xl leading-relaxed"
              style={{
                color: B.cream,
                opacity: 0.75,
                fontWeight: 300,
                fontSize: "0.95rem",
              }}
            >
              From ancient sun-blessed groves to your gift box — a journey of
              craft, care, and reverence. Every date holds a story worth
              telling.
            </p>
            {/* 16:9 Video placeholder */}
            <div
              className="relative mx-auto overflow-hidden"
              style={{
                maxWidth: "760px",
                aspectRatio: "16 / 9",
                background: `linear-gradient(135deg, ${B.maroon}, ${B.maroonDark})`,
                border: `2px solid rgba(201,162,39,0.25)`,
              }}
            >
              {/* Subtle texture overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,162,39,0.06) 0%, transparent 80%)",
                }}
              />
              {/* Play button */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{ cursor: "pointer" }}
              >
                {/* Gold ring + triangle */}
                <div
                  style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "50%",
                    border: `2px solid ${B.gold}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(201,162,39,0.1)",
                  }}
                >
                  <span
                    style={{
                      color: B.gold,
                      fontSize: "1.8rem",
                      lineHeight: 1,
                      paddingLeft: "0.2rem",
                    }}
                  >
                    ▶
                  </span>
                </div>
                {/* Video label */}
                <p
                  className="baraka-display"
                  style={{
                    color: B.cream,
                    fontSize: "1rem",
                    fontStyle: "italic",
                    opacity: 0.9,
                    letterSpacing: "0.02em",
                  }}
                >
                  Watch: From Grove to Gift Box
                </p>
                <p
                  className="baraka-body"
                  style={{
                    color: B.gold,
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    opacity: 0.7,
                  }}
                >
                  3 MIN · BARAKA DATES CO.
                </p>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="mx-auto mt-12 flex max-w-xs items-center gap-4">
              <div
                className="h-px flex-1"
                style={{ background: B.gold, opacity: 0.25 }}
              />
              <span style={{ color: B.gold, opacity: 0.5, fontSize: "0.9rem" }}>
                ❖
              </span>
              <div
                className="h-px flex-1"
                style={{ background: B.gold, opacity: 0.25 }}
              />
            </div>
          </div>
        </section>

        {/* ── GIFT COLLECTIONS ────────────────────────────── */}
        <section
          className="px-4 py-16 sm:px-6 sm:py-20"
          style={{ background: B.maroon }}
        >
          <div className="mx-auto max-w-5xl">
            {/* Section heading */}
            <div className="mb-12 text-center">
              <p
                className="baraka-body mb-2 uppercase tracking-widest"
                style={{
                  color: B.goldLight,
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                }}
              >
                Curated for Every Occasion
              </p>
              <h2
                className="baraka-display mb-4"
                style={{
                  color: B.cream,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 600,
                }}
              >
                Gift Collections
              </h2>
              <div className="flex items-center gap-4 py-2">
                <div
                  className="h-px flex-1"
                  style={{ background: B.goldLight, opacity: 0.3 }}
                />
                <span style={{ color: B.goldLight, fontSize: "1.1rem" }}>
                  ❖
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: B.goldLight, opacity: 0.3 }}
                />
              </div>
            </div>

            {/* Collection tiles */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {giftCollections.map((col) => (
                <div
                  key={col.id}
                  className="baraka-collection-tile p-8 text-center"
                  style={{
                    background: B.maroonDark,
                    border: `1px solid rgba(201,162,39,0.25)`,
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                    {col.icon}
                  </div>
                  <h3
                    className="baraka-display mb-3"
                    style={{
                      color: B.gold,
                      fontSize: "1.4rem",
                      fontWeight: 600,
                    }}
                  >
                    {col.title}
                  </h3>
                  <p
                    className="baraka-body leading-relaxed"
                    style={{
                      color: B.cream,
                      fontSize: "0.85rem",
                      fontWeight: 300,
                      opacity: 0.9,
                    }}
                  >
                    {col.desc}
                  </p>
                  <button
                    className="baraka-btn-outline mt-6"
                    style={{
                      borderColor: B.gold,
                      color: B.gold,
                      padding: "0.55rem 1.5rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    Explore →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PERSONALISE YOUR GIFT ────────────────────────── */}
        <section
          className="px-4 py-16 sm:px-8 sm:py-20"
          style={{ background: B.cream }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p
                className="baraka-body mb-2 uppercase tracking-widest"
                style={{
                  color: B.gold,
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                }}
              >
                Make It Yours
              </p>
              <h2
                className="baraka-display"
                style={{
                  color: B.emerald,
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  fontWeight: 600,
                }}
              >
                Personalise Your Gift
              </h2>
              <p
                className="baraka-body mx-auto mt-3 max-w-md"
                style={{ color: "#666", fontSize: "0.875rem", fontWeight: 300 }}
              >
                Choose the finishing touches that make your gift truly
                memorable.
              </p>
            </div>

            <PersonaliseTiles />
          </div>
        </section>

        {/* ── TESTIMONIAL ─────────────────────────────────── */}
        <section
          className="px-6 py-16 text-center"
          style={{ background: B.creamDark }}
        >
          <span style={{ color: B.gold, fontSize: "1.5rem" }}>❝</span>
          <p
            className="baraka-display mx-auto mt-2 max-w-2xl leading-relaxed"
            style={{
              color: B.emerald,
              fontSize: "1.55rem",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            &ldquo;The most beautiful Eid gift I have ever received. The dates
            were divine &mdash; soft, rich, and full of barakah.&rdquo;
          </p>
          <p
            className="baraka-body mt-4"
            style={{
              color: B.maroon,
              fontSize: "0.82rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}
          >
            — Fatima R., Mumbai
          </p>
        </section>

        {/* ── TRACK YOUR ORDER ────────────────────────────── */}
        <section
          className="px-4 py-14 sm:px-8 sm:py-16"
          style={{ background: B.cream }}
        >
          <div className="mx-auto max-w-xl text-center">
            <p
              className="baraka-body mb-2 uppercase tracking-widest"
              style={{
                color: B.gold,
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
              }}
            >
              Order Support
            </p>
            <h2
              className="baraka-display mb-3"
              style={{
                color: B.emerald,
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                fontWeight: 600,
              }}
            >
              Track Your Order
            </h2>
            <p
              className="baraka-body mb-8 leading-relaxed"
              style={{ color: "#666", fontSize: "0.9rem", fontWeight: 300 }}
            >
              Enter your order ID below to see the latest status of your gift
              shipment.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3 sm:flex-row"
              style={{ maxWidth: "440px", margin: "0 auto" }}
            >
              <input
                type="text"
                placeholder="Enter your order ID"
                className="baraka-body flex-1"
                style={{
                  padding: "0.75rem 1rem",
                  border: `1.5px solid ${B.creamDark}`,
                  background: B.white,
                  color: B.emerald,
                  fontSize: "0.875rem",
                  outline: "none",
                  flexGrow: 1,
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = B.gold;
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    B.creamDark;
                }}
              />
              <button
                type="submit"
                className="baraka-btn-gold"
                style={{ padding: "0.75rem 1.5rem", flexShrink: 0 }}
              >
                Track Order
              </button>
            </form>
            <p
              className="baraka-body mt-4"
              style={{ color: "#999", fontSize: "0.75rem" }}
            >
              Order IDs are emailed at confirmation. Need help?{" "}
              <span style={{ color: B.gold, cursor: "pointer" }}>
                Contact us
              </span>
            </p>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────── */}
        <footer
          className="flex flex-col items-center justify-between gap-4 px-8 py-8 md:flex-row"
          style={{ background: B.emerald }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: B.gold }}>☽</span>
            <span
              className="baraka-display"
              style={{ color: B.cream, fontSize: "1.1rem", fontWeight: 500 }}
            >
              Baraka Dates Co.
            </span>
          </div>
          <p
            className="baraka-body text-center"
            style={{
              color: B.cream,
              fontSize: "0.78rem",
              opacity: 0.6,
              fontWeight: 300,
            }}
          >
            Premium Medjool Dates · Gifted with Love · Made in India
          </p>
          <p
            className="baraka-body"
            style={{ color: B.gold, fontSize: "0.78rem", opacity: 0.8 }}
          >
            © 2025 Baraka Dates Co.
          </p>
        </footer>

        {/* ── WHATSAPP FLOATING BUTTON ──────────────────── */}
        <a
          href="https://wa.me/919800000000?text=Assalamu%20Alaikum%2C%20I%E2%80%99d%20like%20to%20enquire%20about%20your%20dates."
          target="_blank"
          rel="noopener noreferrer"
          title="Chat with us on WhatsApp"
          className="baraka-wa-btn"
          aria-label="Chat with us on WhatsApp"
          style={{
            position: "fixed",
            bottom: "1.75rem",
            right: "1.75rem",
            zIndex: 9999,
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "50%",
            background: B.emerald,
            border: `2px solid ${B.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(15,61,46,0.4)",
            cursor: "pointer",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "scale(1.1)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 8px 28px rgba(15,61,46,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 4px 20px rgba(15,61,46,0.4)";
          }}
        >
          {/* WhatsApp SVG icon in gold */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.472 3.506A11.817 11.817 0 0 0 12.001 0C5.455 0 .124 5.333.121 11.883c-.001 2.095.546 4.14 1.586 5.946L.04 24l6.305-1.654a11.879 11.879 0 0 0 5.653 1.438h.005c6.542 0 11.875-5.335 11.878-11.885a11.817 11.817 0 0 0-3.409-8.393Zm-8.471 18.29a9.86 9.86 0 0 1-5.027-1.376l-.36-.215-3.742.981 1-3.647-.234-.375A9.851 9.851 0 0 1 2.12 11.883C2.122 6.444 6.564 2 12 2a9.83 9.83 0 0 1 6.99 2.899A9.83 9.83 0 0 1 21.88 11.9c-.002 5.438-4.444 9.896-9.879 9.896Zm5.42-7.407c-.297-.149-1.758-.868-2.031-.967-.272-.098-.47-.148-.668.15-.198.297-.767.966-.94 1.164-.172.198-.345.223-.642.074-.296-.149-1.252-.461-2.385-1.47-.881-.785-1.477-1.754-1.65-2.05-.172-.297-.018-.457.13-.605.132-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.372-.025-.52-.074-.149-.667-1.611-.914-2.206-.24-.578-.486-.5-.667-.51-.173-.008-.372-.01-.57-.01a1.09 1.09 0 0 0-.793.372c-.272.297-1.04 1.017-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347Z"
              fill={B.gold}
            />
          </svg>

          {/* Tooltip */}
          <span
            style={{
              position: "absolute",
              right: "calc(100% + 0.6rem)",
              background: B.emerald,
              color: B.cream,
              fontSize: "0.72rem",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.04em",
              padding: "0.35rem 0.75rem",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 0.15s",
              border: `1px solid rgba(201,162,39,0.3)`,
            }}
            className="baraka-wa-tooltip"
          >
            Chat with us
          </span>
        </a>
      </div>
    </>
  );
}

export default BarakaHome;
