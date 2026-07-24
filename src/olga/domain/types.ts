// OL-GA v2 — Domain Types

export type OlgaUserId = string;
export type SpaceId = string;
export type ProposalId = string;
export type MatchId = string;
export type MessageId = string;
export type MeetingId = string;

export interface OlgaUser {
  id: OlgaUserId;
  /** Only available after mutual unlock */
  name: string;
  /** Only available after mutual unlock */
  employer: string;
  /** Only available after mutual unlock */
  photoUrl?: string;
  intents: string[];
  category: string;
}

export interface Zone {
  name: string;
  description: string;
  isActive: boolean;
}

export interface Space {
  id: SpaceId;
  name: string;
  city: string;
  address: string;
  distanceKm: number;
  /** Raw density count. Display as '—' when < 5 (sub-5 suppression). */
  density: number;
  /** Top 3 intent categories present in the space */
  intents: string[];
  /** 0–100: percentage match potential for current user */
  matchPotential: number;
  zones: Zone[];
  /** 24-element array: estimated headcount per hour of day (0–23) */
  peakHours: number[];
}

export interface Proposal {
  id: ProposalId;
  category: string;
  score: number;
  explanation: string;
  intentSummary: string;
  /** Unix milliseconds */
  expiresAt: number;
}

export interface Match {
  id: MatchId;
  user: OlgaUser;
  score: number;
  explanation: string;
  /** Unix milliseconds */
  matchedAt: number;
  space: Pick<Space, "id" | "name">;
  hasOutcome: boolean;
}

export interface Message {
  id: MessageId;
  matchId: MatchId;
  variant: "own" | "other";
  text: string;
  /** Unix milliseconds */
  sentAt: number;
}

export interface Meeting {
  id: MeetingId;
  matchId: MatchId;
  /** ISO 8601 datetime string */
  proposedAt: string;
  venueName: string;
  zone: string;
  status: "pending" | "confirmed";
}

export type OutcomeValue =
  | "meaningful-conversation"
  | "exchanged-contacts"
  | "follow-up-planned"
  | "not-relevant";

export type PresenceStatus = "active" | "expiring" | "inactive";

export type CardState =
  | "default"
  | "pressed"
  | "approved-waiting"
  | "declined-collapse"
  | "expired";
