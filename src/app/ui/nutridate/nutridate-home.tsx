/* ============================================================
   NutriDate — Brand Homepage
   Palette: Olive #3D4A34 | Mustard #D98E2B | Off-White #F6F4EE | Charcoal #2A2A26
   Fonts: Space Grotesk (display) | Inter (body) | IBM Plex Mono (data)
   ============================================================ */
import { useState } from "react";

const N = {
  olive: "#3D4A34",
  oliveDark: "#2C3626",
  mustard: "#D98E2B",
  mustardLight: "#E8A84A",
  mustardDark: "#B8761E",
  offWhite: "#F6F4EE",
  offWhiteDark: "#EDEAE0",
  charcoal: "#2A2A26",
  charcoalLight: "#444440",
  white: "#FFFFFF",
  gray: "#8A8A82",
};

const products = [
  {
    id: 1,
    name: "Classic Medjool",
    weight: "500g",
    price: "₹599",
    tag: "Best Seller",
    nutrition: [
      { label: "Calories", value: "277 kcal/100g" },
      { label: "Fiber", value: "6.7g/100g" },
      { label: "Potassium", value: "696mg/100g" },
    ],
    rating: 4.8,
    reviewCount: 312,
    harvest: "Oct 2024",
    desc: "The gold standard. Consistently large, naturally sweet, zero additives.",
  },
  {
    id: 2,
    name: "Performance Pack",
    weight: "1kg",
    price: "₹1,049",
    tag: "Best Value",
    nutrition: [
      { label: "Calories", value: "277 kcal/100g" },
      { label: "Fiber", value: "6.7g/100g" },
      { label: "Magnesium", value: "54mg/100g" },
    ],
    rating: 4.7,
    reviewCount: 188,
    harvest: "Nov 2024",
    desc: "Bulk pack for athletes and active households. Same premium quality, better economics.",
  },
  {
    id: 3,
    name: "Trial Box",
    weight: "250g",
    price: "₹329",
    tag: "Try First",
    nutrition: [
      { label: "Calories", value: "277 kcal/100g" },
      { label: "Iron", value: "0.9mg/100g" },
      { label: "Sugar (natural)", value: "63.4g/100g" },
    ],
    rating: 4.6,
    reviewCount: 97,
    harvest: "Sep 2024",
    desc: "Not sure yet? Try 250g before committing. No subscription, no pressure.",
  },
];

const benefits = [
  {
    id: 1,
    icon: "🌾",
    title: "High Natural Fiber",
    stat: "6.7g per 100g",
    desc: "Supports gut health and keeps you fuller for longer without spiking blood sugar.",
  },
  {
    id: 2,
    icon: "🚫",
    title: "No Added Sugar",
    stat: "0g added",
    desc: "All sweetness is intrinsic to the date. No syrups, no concentrates, no fillers.",
  },
  {
    id: 3,
    icon: "⚡",
    title: "Rich in Potassium",
    stat: "696mg per 100g",
    desc: "Electrolyte-dense for muscle function, hydration, and cardiovascular support.",
  },
  {
    id: 4,
    icon: "🔋",
    title: "Satiating Energy",
    stat: "277 kcal/100g",
    desc: "Complex carbohydrates for sustained energy — the original pre-workout snack.",
  },
];

/* ── Newsletter Signup Component ─────────────────────────── */
function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      style={{
        background: "#2A2A26",
        padding: "4rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <span
          className="nd-mono"
          style={{
            color: "#D98E2B",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            display: "block",
            marginBottom: "0.75rem",
          }}
        >
          {"// WEEKLY_INSIGHTS"}
        </span>
        <h2
          className="nd-display"
          style={{
            color: "#F6F4EE",
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            fontWeight: 700,
            margin: "0 0 0.75rem",
            lineHeight: 1.2,
          }}
        >
          Get weekly nutrition insights
        </h2>
        <p
          className="nd-body"
          style={{
            color: "#8A8A82",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            margin: "0 0 2rem",
          }}
        >
          Science-backed, no hype. One email per week on fuelling smarter with
          whole foods — dates and beyond.
        </p>

        {submitted ? (
          <div
            style={{
              background: "rgba(217,142,43,0.12)",
              border: "1px solid rgba(217,142,43,0.3)",
              borderRadius: "8px",
              padding: "1rem 1.5rem",
            }}
          >
            <span
              className="nd-mono"
              style={{ color: "#D98E2B", fontSize: "0.85rem" }}
            >
              ✓ subscribed successfully
            </span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div style={{ flex: "1 1 260px", maxWidth: "340px" }}>
              <label
                className="nd-mono"
                style={{
                  display: "block",
                  color: "#444440",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textAlign: "left",
                  marginBottom: "0.3rem",
                }}
              >
                EMAIL_ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#1a1a18",
                  border: "1px solid #444440",
                  color: "#F6F4EE",
                  fontSize: "0.875rem",
                  fontFamily: "IBM Plex Mono, monospace",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              className="nd-btn-primary"
              style={{
                alignSelf: "flex-end",
                padding: "0.75rem 1.75rem",
                flexShrink: 0,
              }}
            >
              Subscribe
            </button>
          </form>
        )}

        <p
          className="nd-mono"
          style={{
            color: "#444440",
            fontSize: "0.65rem",
            marginTop: "1.25rem",
            letterSpacing: "0.04em",
          }}
        >
          No spam. Unsubscribe any time. ~300 word emails only.
        </p>
      </div>
    </section>
  );
}

/* ── FAQ Accordion ─────────────────────────────────────────── */
function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "Are these dates really natural?",
      a: "Yes. Our Medjool dates are harvested without any additives, preservatives, or added sugar. What you see on the nutrition label is exactly what nature put in.",
    },
    {
      q: "How long do they stay fresh?",
      a: "Stored in a cool, dry place (15–20°C), sealed Medjool dates keep for 6–12 months. After opening, we recommend refrigerating and consuming within 4–6 weeks.",
    },
    {
      q: "Can I return if I don't like them?",
      a: "We offer a no-questions-asked return within 7 days of delivery if the product is unopened. For quality complaints, contact us within 48 hours and we'll make it right.",
    },
    {
      q: "Do you ship pan-India?",
      a: "Yes — we deliver to all major cities and most tier-2 towns via our courier partners. Free shipping on orders above ₹499. Delivery typically takes 2–4 business days.",
    },
    {
      q: "What is the shelf life after opening?",
      a: "Once opened, transfer to an airtight container and refrigerate. Consume within 4–6 weeks for best flavour and texture. Do not store in direct sunlight or humidity.",
    },
  ];

  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20"
      style={{ background: N.offWhite }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-10">
          <span
            className="nd-mono mb-2 block"
            style={{
              color: N.mustard,
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
            }}
          >
            {"// FAQ"}
          </span>
          <h2
            className="nd-display"
            style={{
              color: N.charcoal,
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              fontWeight: 700,
            }}
          >
            Common Questions
          </h2>
          <div className="mt-3 h-0.5 w-12" style={{ background: N.mustard }} />
        </div>

        {/* Accordion items */}
        <div className="flex flex-col">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  borderBottom: `1px solid ${N.offWhiteDark}`,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="nd-body flex w-full items-center justify-between gap-4 py-5 text-left"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "1.25rem 0",
                  }}
                >
                  <span
                    style={{
                      color: N.charcoal,
                      fontSize: "0.95rem",
                      fontWeight: isOpen ? 600 : 500,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="nd-mono flex-shrink-0"
                    style={{
                      color: N.mustard,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="nd-body pb-5"
                    style={{
                      color: N.charcoalLight,
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      borderLeft: `3px solid ${N.mustard}`,
                      paddingLeft: "1rem",
                      paddingBottom: "1.25rem",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function NutriDateHome() {
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .nd-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .nd-body    { font-family: 'Inter', system-ui, sans-serif; }
        .nd-mono    { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
        .nd-btn-primary {
          background: ${N.mustard};
          color: ${N.white};
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.02em;
          padding: 0.75rem 2rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .nd-btn-primary:hover { background: ${N.mustardLight}; }
        .nd-btn-secondary {
          background: transparent;
          color: ${N.mustard};
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          padding: 0.73rem 2rem;
          border: 1.5px solid ${N.mustard};
          cursor: pointer;
          transition: all 0.2s;
        }
        .nd-btn-secondary:hover { background: rgba(217,142,43,0.08); }
        .nd-btn-dark {
          background: ${N.charcoal};
          color: ${N.white};
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.75rem 2.25rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .nd-btn-dark:hover { background: ${N.charcoalLight}; }
        .nd-product-card { transition: transform 0.2s, box-shadow 0.2s; }
        .nd-product-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(42,42,38,0.12); }
        .nd-tag {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 0.2rem 0.6rem;
          background: ${N.mustard};
          color: ${N.white};
        }
      `}</style>

      <div className="nd-body" style={{ background: N.offWhite, minWidth: 0 }}>
        {/* ── NAV ─────────────────────────────────────────── */}
        <nav
          className="flex items-center justify-between px-4 py-4 sm:px-8"
          style={{ background: N.charcoal }}
        >
          <div className="flex items-center gap-2">
            <span
              style={{ color: N.mustard, fontSize: "1.3rem", fontWeight: 700 }}
            >
              ◈
            </span>
            <span
              className="nd-display"
              style={{
                color: N.white,
                fontSize: "1.25rem",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              NutriDate
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {["Products", "Nutrition", "About", "Reviews"].map((item) => (
              <button
                key={item}
                className="nd-body"
                style={{
                  background: "none",
                  border: "none",
                  color: N.offWhite,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  opacity: 0.75,
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            className="nd-btn-primary"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}
          >
            Shop Now
          </button>
        </nav>

        {/* ── HERO ────────────────────────────────────────── */}
        <section
          className="relative flex min-h-[520px] flex-col items-start justify-center px-4 py-14 sm:flex-row sm:px-8 sm:py-20"
          style={{ background: N.offWhite }}
        >
          {/* Accent shape */}
          <div
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 md:block"
            style={{
              background: `linear-gradient(135deg, ${N.olive} 0%, ${N.oliveDark} 100%)`,
              clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          >
            <div
              className="flex h-full items-center justify-center"
              style={{ paddingLeft: "10%" }}
            >
              <div className="text-center">
                <span style={{ fontSize: "5rem" }}>🌴</span>
                <p
                  className="nd-mono mt-2"
                  style={{
                    color: N.mustard,
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  MEDJOOL_DATES.raw
                </p>
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative z-10 w-full max-w-xl">
            <span
              className="nd-mono mb-4 block"
              style={{
                color: N.mustard,
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
              }}
            >
              {"// 100% NATURAL · ZERO ADDITIVES"}
            </span>
            <h1
              className="nd-display mb-5 leading-none"
              style={{
                color: N.charcoal,
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 700,
              }}
            >
              Fuel Smarter.
              <br />
              <span style={{ color: N.mustard }}>Date Better.</span>
            </h1>
            <p
              className="nd-body mb-8 leading-relaxed"
              style={{
                color: N.charcoalLight,
                fontSize: "1rem",
                fontWeight: 400,
                maxWidth: "420px",
              }}
            >
              Premium Medjool dates. No fluff, no hype. Just a whole food
              that&apos;s high in fiber, rich in potassium, and genuinely
              delicious.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="nd-btn-primary">Order Now</button>
              <button className="nd-btn-secondary">See Nutrition Facts</button>
            </div>

            {/* Quick stats row */}
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { v: "6.7g", l: "Fiber /100g" },
                { v: "696mg", l: "Potassium /100g" },
                { v: "0g", l: "Added Sugar" },
              ].map((s) => (
                <div key={s.l}>
                  <p
                    className="nd-mono"
                    style={{
                      color: N.charcoal,
                      fontSize: "1.35rem",
                      fontWeight: 500,
                    }}
                  >
                    {s.v}
                  </p>
                  <p
                    className="nd-body"
                    style={{
                      color: N.gray,
                      fontSize: "0.72rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ────────────────────────────────────── */}
        <section
          className="px-4 py-16 sm:px-6 sm:py-20"
          style={{ background: N.white }}
        >
          <div className="mx-auto max-w-5xl">
            {/* Section heading */}
            <div className="mb-12">
              <span
                className="nd-mono mb-2 block"
                style={{
                  color: N.mustard,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                }}
              >
                {"// PRODUCTS"}
              </span>
              <h2
                className="nd-display"
                style={{
                  color: N.charcoal,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  fontWeight: 700,
                }}
              >
                Choose Your Pack
              </h2>
              <div
                className="mt-3 h-0.5 w-12"
                style={{ background: N.mustard }}
              />
            </div>

            {/* Product cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="nd-product-card flex flex-col"
                  style={{
                    background: N.offWhite,
                    border: `1px solid ${N.offWhiteDark}`,
                  }}
                >
                  {/* Top: product image area */}
                  <div
                    className="relative flex flex-col items-center justify-center p-8"
                    style={{ background: N.olive }}
                  >
                    <span style={{ fontSize: "2.5rem" }}>🌴</span>
                    <p
                      className="nd-display mt-2"
                      style={{
                        color: N.offWhite,
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {product.weight}
                    </p>
                    {/* Freshness badge */}
                    <span
                      className="nd-mono absolute bottom-2 left-2"
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        color: "#ffffff",
                        fontSize: "0.6rem",
                        letterSpacing: "0.05em",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "2px",
                      }}
                    >
                      Harvested: {product.harvest}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <span className="nd-tag">{product.tag}</span>
                        <h3
                          className="nd-display mt-2"
                          style={{
                            color: N.charcoal,
                            fontSize: "1.15rem",
                            fontWeight: 600,
                          }}
                        >
                          {product.name}
                        </h3>
                        {/* Star rating */}
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className="nd-mono"
                            style={{
                              color: N.mustard,
                              fontSize: "0.8rem",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {"★".repeat(Math.floor(product.rating))}
                            {product.rating % 1 >= 0.5 ? "½" : ""}
                          </span>
                          <span
                            className="nd-mono"
                            style={{ color: N.gray, fontSize: "0.68rem" }}
                          >
                            ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                      <span
                        className="nd-display"
                        style={{
                          color: N.mustard,
                          fontSize: "1.25rem",
                          fontWeight: 700,
                        }}
                      >
                        {product.price}
                      </span>
                    </div>

                    <p
                      className="nd-body mb-4"
                      style={{
                        color: N.gray,
                        fontSize: "0.83rem",
                        lineHeight: "1.6",
                      }}
                    >
                      {product.desc}
                    </p>

                    {/* Nutrition stats */}
                    <div
                      className="mb-4 p-3"
                      style={{
                        background: N.offWhiteDark,
                        borderLeft: `3px solid ${N.mustard}`,
                      }}
                    >
                      {product.nutrition.map((n) => (
                        <div
                          key={n.label}
                          className="flex items-center justify-between py-0.5"
                        >
                          <span
                            className="nd-body"
                            style={{
                              color: N.charcoalLight,
                              fontSize: "0.75rem",
                            }}
                          >
                            {n.label}
                          </span>
                          <span
                            className="nd-mono"
                            style={{
                              color: N.charcoal,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {n.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button className="nd-btn-primary mt-auto w-full">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ──────────────────────────── */}
        <section
          className="px-4 py-16 sm:px-6 sm:py-20"
          style={{ background: N.offWhite }}
        >
          <div className="mx-auto max-w-5xl">
            {/* Heading */}
            <div className="mb-10">
              <span
                className="nd-mono mb-2 block"
                style={{
                  color: N.mustard,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                }}
              >
                {"// HOW_WE_COMPARE"}
              </span>
              <h2
                className="nd-display"
                style={{
                  color: N.charcoal,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  fontWeight: 700,
                }}
              >
                Compare the Numbers
              </h2>
              <p
                className="nd-body mt-2"
                style={{ color: N.gray, fontSize: "0.875rem" }}
              >
                Per 100g serving · Source: USDA FoodData Central
              </p>
              <div
                className="mt-3 h-0.5 w-12"
                style={{ background: N.mustard }}
              />
            </div>

            {/* Table */}
            <div
              className="overflow-x-auto"
              style={{
                border: `1px solid ${N.offWhiteDark}`,
                borderRadius: "8px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "560px",
                }}
              >
                <thead>
                  <tr style={{ background: N.charcoal }}>
                    <th
                      className="nd-body"
                      style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        color: N.offWhite,
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                        width: "25%",
                      }}
                    >
                      Metric
                    </th>
                    {[
                      {
                        label: "NutriDate Medjool",
                        sub: "Dates",
                        highlight: true,
                      },
                      { label: "Granola Bar", sub: null, highlight: false },
                      { label: "Banana", sub: null, highlight: false },
                      { label: "Milk Chocolate", sub: null, highlight: false },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className="nd-body"
                        style={{
                          padding: "0.875rem 1.25rem",
                          textAlign: "center",
                          color: col.highlight ? N.mustard : N.offWhite,
                          fontSize: "0.78rem",
                          letterSpacing: "0.04em",
                          fontWeight: 600,
                          borderLeft: col.highlight
                            ? `3px solid ${N.mustard}`
                            : `1px solid rgba(255,255,255,0.08)`,
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      metric: "Fiber",
                      ndValue: "6.7g",
                      ndNote: "↑ High",
                      granola: "2.5g",
                      banana: "2.6g",
                      choc: "3.4g",
                      ndGood: true,
                    },
                    {
                      metric: "Natural Sugar",
                      ndValue: "63.4g",
                      ndNote: "No added",
                      granola: "22g+",
                      banana: "12.2g",
                      choc: "52g",
                      ndGood: true,
                    },
                    {
                      metric: "Potassium",
                      ndValue: "696mg",
                      ndNote: "↑ Rich",
                      granola: "170mg",
                      banana: "358mg",
                      choc: "372mg",
                      ndGood: true,
                    },
                    {
                      metric: "Calories",
                      ndValue: "277 kcal",
                      ndNote: "Whole food",
                      granola: "450 kcal",
                      banana: "89 kcal",
                      choc: "546 kcal",
                      ndGood: false,
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.metric}
                      style={{
                        background: i % 2 === 0 ? N.offWhite : N.offWhiteDark,
                        borderBottom: `1px solid ${N.offWhiteDark}`,
                      }}
                    >
                      {/* Metric label */}
                      <td
                        className="nd-body"
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: N.charcoal,
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        }}
                      >
                        {row.metric}
                      </td>
                      {/* NutriDate column — highlighted */}
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          textAlign: "center",
                          borderLeft: `3px solid ${N.mustard}`,
                          background: "rgba(217,142,43,0.06)",
                        }}
                      >
                        <p
                          className="nd-mono"
                          style={{
                            color: N.charcoal,
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {row.ndValue}
                        </p>
                        <p
                          className="nd-mono"
                          style={{
                            color: N.mustard,
                            fontSize: "0.65rem",
                            margin: "0.15rem 0 0",
                            opacity: 0.9,
                          }}
                        >
                          {row.ndNote}
                        </p>
                      </td>
                      {/* Comparison columns */}
                      {[row.granola, row.banana, row.choc].map((val, ci) => (
                        <td
                          key={ci}
                          className="nd-mono"
                          style={{
                            padding: "0.875rem 1.25rem",
                            textAlign: "center",
                            color: N.charcoalLight,
                            fontSize: "0.875rem",
                            borderLeft: `1px solid ${N.offWhiteDark}`,
                          }}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: N.offWhiteDark }}>
                    <td
                      colSpan={5}
                      className="nd-mono"
                      style={{
                        padding: "0.6rem 1.25rem",
                        color: N.gray,
                        fontSize: "0.65rem",
                        letterSpacing: "0.04em",
                        borderTop: `1px solid ${N.offWhiteDark}`,
                      }}
                    >
                      * All values per 100g. Granola figures represent avg.
                      commercial granola bar. Natural sugar = total sugars (no
                      added sugar in NutriDate). USDA FDC.
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────── */}
        <section
          className="px-4 py-16 sm:px-6 sm:py-20"
          style={{ background: N.offWhite }}
        >
          <div className="mx-auto max-w-5xl">
            {/* Heading */}
            <div className="mb-12 text-center">
              <span
                className="nd-mono mb-2 block"
                style={{
                  color: N.mustard,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                }}
              >
                {"// HOW_IT_WORKS"}
              </span>
              <h2
                className="nd-display"
                style={{
                  color: N.charcoal,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  fontWeight: 700,
                }}
              >
                Simple as 1, 2, 3
              </h2>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                {
                  num: "01",
                  icon: "🛒",
                  title: "Choose your pack",
                  desc: "Pick the size that fits your lifestyle — trial box, classic 500g, or the 1kg performance pack.",
                },
                {
                  num: "02",
                  icon: "🚀",
                  title: "We ship in 48h",
                  desc: "Orders packed and dispatched within 48 hours. Pan-India delivery. Cold-chain handled.",
                },
                {
                  num: "03",
                  icon: "⚡",
                  title: "Fuel smarter",
                  desc: "Swap the processed snacks. Let whole-food energy carry you through the day.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="relative flex flex-col items-start gap-4"
                  style={{
                    background: N.white,
                    border: `1px solid ${N.offWhiteDark}`,
                    padding: "2rem 1.75rem",
                  }}
                >
                  {/* Step number */}
                  <span
                    className="nd-display"
                    style={{
                      color: N.mustard,
                      fontSize: "3rem",
                      fontWeight: 700,
                      lineHeight: 1,
                      opacity: 0.25,
                      position: "absolute",
                      top: "1rem",
                      right: "1.25rem",
                    }}
                  >
                    {step.num}
                  </span>
                  {/* Icon */}
                  <span
                    style={{
                      fontSize: "1.8rem",
                      width: "3rem",
                      height: "3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(217,142,43,0.1)",
                    }}
                  >
                    {step.icon}
                  </span>
                  {/* Text */}
                  <div>
                    <h3
                      className="nd-display mb-2"
                      style={{
                        color: N.charcoal,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="nd-body leading-relaxed"
                      style={{ color: N.gray, fontSize: "0.875rem" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FaqAccordion />

        {/* ── BENEFITS ────────────────────────────────────── */}
        <section
          className="px-4 py-16 sm:px-6 sm:py-20"
          style={{ background: N.olive }}
        >
          <div className="mx-auto max-w-5xl">
            {/* Section heading */}
            <div className="mb-14 text-center">
              <span
                className="nd-mono mb-2 block"
                style={{
                  color: N.mustard,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                }}
              >
                {"// WHY_DATES"}
              </span>
              <h2
                className="nd-display"
                style={{
                  color: N.offWhite,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  fontWeight: 700,
                }}
              >
                What the Science Says
              </h2>
              <p
                className="nd-body mx-auto mt-3 max-w-lg"
                style={{ color: N.offWhite, fontSize: "0.9rem", opacity: 0.7 }}
              >
                We don&apos;t make health claims we can&apos;t back up.
                Here&apos;s what&apos;s actually documented about Medjool dates.
              </p>
            </div>

            {/* Benefits grid */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
              {benefits.map((b) => (
                <div key={b.id} className="text-center">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center"
                    style={{
                      background: "rgba(217,142,43,0.15)",
                      fontSize: "1.6rem",
                    }}
                  >
                    {b.icon}
                  </div>
                  <h3
                    className="nd-display mb-1"
                    style={{
                      color: N.offWhite,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="nd-mono mb-3"
                    style={{ color: N.mustard, fontSize: "0.8rem" }}
                  >
                    {b.stat}
                  </p>
                  <p
                    className="nd-body"
                    style={{
                      color: N.offWhite,
                      fontSize: "0.82rem",
                      opacity: 0.75,
                      lineHeight: "1.65",
                    }}
                  >
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="nd-mono mt-12 text-center"
              style={{
                color: N.offWhite,
                fontSize: "0.68rem",
                opacity: 0.4,
                letterSpacing: "0.06em",
              }}
            >
              * Nutritional data sourced from USDA FoodData Central. Always
              consult a healthcare professional for personalised dietary
              guidance.
            </p>
          </div>
        </section>

        {/* ── SOCIAL PROOF ROW ────────────────────────────── */}
        <section
          className="flex flex-wrap items-center justify-center gap-6 px-4 py-10 sm:gap-12 sm:px-8"
          style={{ background: N.offWhiteDark }}
        >
          {[
            { v: "4.8★", l: "Average Rating" },
            { v: "3,200+", l: "Orders Delivered" },
            { v: "92%", l: "Repeat Customers" },
            { v: "2 days", l: "Avg. Delivery" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p
                className="nd-display"
                style={{
                  color: N.charcoal,
                  fontSize: "1.8rem",
                  fontWeight: 700,
                }}
              >
                {s.v}
              </p>
              <p
                className="nd-body"
                style={{ color: N.gray, fontSize: "0.78rem" }}
              >
                {s.l}
              </p>
            </div>
          ))}
        </section>

        {/* ── NEWSLETTER SIGNUP ────────────────────────── */}
        <NewsletterSignup />

        {/* ── CTA BANNER ──────────────────────────────────── */}
        <section
          className="flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ background: N.mustard }}
        >
          <span
            className="nd-mono mb-3 block"
            style={{
              color: N.white,
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              opacity: 0.8,
            }}
          >
            {"// LIMITED_STOCK"}
          </span>
          <h2
            className="nd-display mb-3"
            style={{
              color: N.white,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
            }}
          >
            Ready to make the switch?
          </h2>
          <p
            className="nd-body mb-8"
            style={{
              color: N.white,
              fontSize: "1rem",
              opacity: 0.9,
              maxWidth: "440px",
            }}
          >
            Ditch the processed snacks. Get premium Medjool dates delivered to
            your door in 48 hours.
          </p>
          <button className="nd-btn-dark">Order Now →</button>
        </section>

        {/* ── FOOTER ──────────────────────────────────────── */}
        <footer
          className="flex flex-col items-center justify-between gap-4 px-8 py-8 md:flex-row"
          style={{ background: N.charcoal }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: N.mustard, fontWeight: 700 }}>◈</span>
            <span
              className="nd-display"
              style={{ color: N.white, fontSize: "1rem", fontWeight: 600 }}
            >
              NutriDate
            </span>
          </div>
          <p
            className="nd-mono text-center"
            style={{
              color: N.white,
              fontSize: "0.72rem",
              opacity: 0.4,
              letterSpacing: "0.04em",
            }}
          >
            Premium Medjool Dates · India · No BS
          </p>
          <p
            className="nd-body"
            style={{ color: N.white, fontSize: "0.72rem", opacity: 0.5 }}
          >
            © 2025 NutriDate
          </p>
        </footer>
      </div>
    </>
  );
}

export default NutriDateHome;
