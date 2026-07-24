// OL-GA v2 — Mock Data (London)
import type { Space, Proposal, Match, Message, Meeting } from "./types";

const now = Date.now();
const oneHour = 60 * 60 * 1000;

// ─── Spaces ────────────────────────────────────────────────────────────────

export const mockSpaces: Space[] = [
  {
    id: "space-01",
    name: "Soho Works White City",
    city: "London",
    address: "2 Television Centre, Wood Lane, W12 7FR",
    distanceKm: 3.2,
    density: 48,
    intents: ["Strategic partnerships", "Angel investing", "BD conversations"],
    matchPotential: 91,
    zones: [
      {
        name: "The Lounge",
        description: "Open seating, ideal for informal introductions",
        isActive: true,
      },
      {
        name: "Private Booths",
        description: "Bookable pods for focused 1:1s",
        isActive: false,
      },
    ],
    peakHours: [
      0, 0, 0, 0, 0, 0, 2, 8, 24, 38, 42, 44, 40, 36, 38, 44, 48, 42, 32, 18, 10, 4, 1, 0,
    ],
  },
  {
    id: "space-02",
    name: "Protein Studios Shoreditch",
    city: "London",
    address: "31 New Inn Yard, EC2A 3EY",
    distanceKm: 1.8,
    density: 8,
    intents: ["Technical co-founders", "Product feedback", "BD conversations"],
    matchPotential: 85,
    zones: [
      {
        name: "Ground Floor",
        description: "Communal workspace with natural light",
        isActive: true,
      },
    ],
    peakHours: [0, 0, 0, 0, 0, 0, 0, 4, 12, 18, 22, 20, 14, 16, 20, 18, 14, 8, 4, 2, 0, 0, 0, 0],
  },
  {
    id: "space-03",
    name: "Second Home Spitalfields",
    city: "London",
    address: "68-80 Hanbury St, E1 5JL",
    distanceKm: 2.1,
    density: 24,
    intents: ["Strategic partnerships", "Technical co-founders", "Product feedback"],
    matchPotential: 78,
    zones: [
      {
        name: "Garden Room",
        description: "Light-filled atrium, great for relaxed conversations",
        isActive: true,
      },
      {
        name: "Library",
        description: "Quiet zone — introductions by message only",
        isActive: false,
      },
    ],
    peakHours: [0, 0, 0, 0, 0, 0, 1, 6, 18, 28, 32, 30, 28, 26, 28, 30, 26, 20, 14, 8, 3, 1, 0, 0],
  },
  {
    id: "space-04",
    name: "WeWork Monument",
    city: "London",
    address: "17 Columbus Courtyard, EC2V 8BT",
    distanceKm: 4.5,
    density: 12,
    intents: ["Angel investing", "BD conversations", "Product feedback"],
    matchPotential: 64,
    zones: [
      {
        name: "Common Area",
        description: "Central hub across three floors",
        isActive: true,
      },
    ],
    peakHours: [0, 0, 0, 0, 0, 0, 2, 10, 20, 28, 30, 28, 22, 20, 24, 26, 22, 14, 8, 4, 2, 0, 0, 0],
  },
  {
    id: "space-05",
    name: "The Hoxton Boardroom",
    city: "London",
    address: "199-206 High Holborn, WC1V 7BD",
    distanceKm: 0.9,
    density: 3, // Sub-5: display suppressed
    intents: ["Strategic partnerships", "Angel investing", "Technical co-founders"],
    matchPotential: 42,
    zones: [
      {
        name: "Private Dining Room",
        description: "Reserved for booked introductions only",
        isActive: false,
      },
    ],
    peakHours: [0, 0, 0, 0, 0, 0, 0, 2, 6, 12, 14, 12, 10, 8, 10, 12, 10, 6, 4, 2, 0, 0, 0, 0],
  },
];

// ─── Proposals ─────────────────────────────────────────────────────────────

export const mockProposals: Proposal[] = [
  {
    id: "proposal-01",
    category: "Strategic partnerships",
    score: 94,
    explanation:
      "Both targeting Series A SaaS companies in fintech — rare overlap in investment thesis and operator experience.",
    intentSummary: "Open to: Strategic partnerships, cross-border BD, introductions to LP networks",
    expiresAt: now + 4 * oneHour,
  },
  {
    id: "proposal-02",
    category: "Technical co-founders",
    score: 87,
    explanation:
      "Complementary technical depth: you bring distribution, they bring infrastructure — classic founding pair.",
    intentSummary: "Open to: Co-founder conversations, early-stage equity, technical collaboration",
    expiresAt: now + 6 * oneHour,
  },
  {
    id: "proposal-03",
    category: "BD conversations",
    score: 81,
    explanation:
      "Same target market (enterprise procurement), different entry points — natural channel partnership.",
    intentSummary: "Open to: BD conversations, pilot partnerships, warm intros",
    expiresAt: now + 8 * oneHour,
  },
  {
    id: "proposal-04",
    category: "Angel investing",
    score: 72,
    explanation:
      "Both active in climate tech with overlapping portfolio thesis — worth a 15-minute exchange.",
    intentSummary: "Open to: Angel investing, syndicate leads, due diligence calls",
    expiresAt: now + 2 * oneHour,
  },
];

// ─── Matches ───────────────────────────────────────────────────────────────

export const mockMatches: Match[] = [
  {
    id: "match-01",
    user: {
      id: "user-01",
      name: "Priya Sharma",
      employer: "Lightspeed Venture Partners",
      photoUrl: undefined,
      intents: ["Strategic partnerships", "Angel investing"],
      category: "Strategic partnerships",
    },
    score: 94,
    explanation:
      "Both targeting Series A SaaS companies in fintech — rare overlap in investment thesis and operator experience.",
    matchedAt: now - 2 * oneHour,
    space: { id: "space-01", name: "Soho Works White City" },
    hasOutcome: false,
  },
  {
    id: "match-02",
    user: {
      id: "user-02",
      name: "Marcus Obi",
      employer: "Blockchain Capital (London)",
      photoUrl: undefined,
      intents: ["Technical co-founders", "BD conversations"],
      category: "Technical co-founders",
    },
    score: 87,
    explanation:
      "Complementary technical depth: you bring distribution, they bring infrastructure — classic founding pair.",
    matchedAt: now - 5 * oneHour,
    space: { id: "space-02", name: "Protein Studios Shoreditch" },
    hasOutcome: false,
  },
];

// ─── Messages ──────────────────────────────────────────────────────────────

export const mockMessages: Message[] = [
  {
    id: "msg-01",
    matchId: "match-01",
    variant: "other",
    text: "Hi — great to connect. I saw we're both focused on fintech Series A, would love to compare notes on what you're seeing in the market right now.",
    sentAt: now - 90 * 60 * 1000,
  },
  {
    id: "msg-02",
    matchId: "match-01",
    variant: "own",
    text: "Likewise! We've been watching the embedded finance space closely. Are you more infrastructure or application layer at the moment?",
    sentAt: now - 85 * 60 * 1000,
  },
  {
    id: "msg-03",
    matchId: "match-01",
    variant: "other",
    text: "Primarily infrastructure — ledger and core banking API plays. We think the abstraction layer is still very much unsolved.",
    sentAt: now - 80 * 60 * 1000,
  },
  {
    id: "msg-04",
    matchId: "match-01",
    variant: "own",
    text: "Interesting. We've actually got a portfolio company doing exactly that — could be worth an intro if there's appetite.",
    sentAt: now - 75 * 60 * 1000,
  },
  {
    id: "msg-05",
    matchId: "match-01",
    variant: "other",
    text: "Absolutely, I'd welcome that. What stage are they at?",
    sentAt: now - 70 * 60 * 1000,
  },
  {
    id: "msg-06",
    matchId: "match-01",
    variant: "own",
    text: "Just closed seed, raising an $8M Series A now. Strong ARR growth, expanding into Germany next quarter.",
    sentAt: now - 65 * 60 * 1000,
  },
  {
    id: "msg-07",
    matchId: "match-01",
    variant: "other",
    text: "Perfect timing. Let me know a good slot to speak properly — perhaps tomorrow afternoon?",
    sentAt: now - 30 * 60 * 1000,
  },
  {
    id: "msg-08",
    matchId: "match-01",
    variant: "own",
    text: "Tomorrow works well. Shall we say 3 PM at the same venue?",
    sentAt: now - 10 * 60 * 1000,
  },
];

// ─── Meeting ───────────────────────────────────────────────────────────────

export const mockMeeting: Meeting = {
  id: "meeting-01",
  matchId: "match-01",
  proposedAt: new Date(Date.now() + 20 * oneHour).toISOString(),
  venueName: "Soho Works White City",
  zone: "The Lounge",
  status: "confirmed",
};
