import { CharacterId } from "@domain/character";
import { ChatRoomMember, TurnMode } from "./chat-room";

// Parses @mentions out of free-form user text, matching against known member
// names. Longest-name-first so "Captain Marlow" is preferred over a
// coincidental "Marlow" substring match, and names containing spaces are
// matched correctly.
export const parseMentions = (
  text: string,
  characterNamesById: Record<CharacterId, string>
): CharacterId[] => {
  const entries = Object.entries(characterNamesById).sort(([, a], [, b]) => b.length - a.length);

  const textLower = text.toLowerCase();
  const matched: CharacterId[] = [];

  for (const [characterId, name] of entries) {
    const mentionLower = `@${name.toLowerCase()}`;
    if (textLower.includes(mentionLower) && !matched.includes(characterId)) {
      matched.push(characterId);
    }
  }

  return matched;
};

export interface ScheduleTurnArgs {
  members: ChatRoomMember[];
  turnMode: TurnMode;
  lastSpeakerOrder?: number;
  userText: string;
  characterNamesById: Record<CharacterId, string>;
  recentSpeakerIds: CharacterId[];
  random?: () => number;
}

const scheduleRoundRobin = (
  members: ChatRoomMember[],
  lastSpeakerOrder: number | undefined
): CharacterId[] => {
  const unmuted = members.filter((m) => !m.muted);
  if (unmuted.length === 0) return [];

  const sorted = [...unmuted].sort((a, b) => a.order - b.order);
  const startAfter = lastSpeakerOrder ?? -Infinity;

  // Find the first unmuted member whose order comes after the cursor;
  // wrap around to the head of the list if none does.
  const next = sorted.find((m) => m.order > startAfter) ?? sorted[0];

  return next ? [next.characterId] : [];
};

const scheduleNatural = (
  members: ChatRoomMember[],
  mentioned: CharacterId[],
  recentSpeakerIds: CharacterId[],
  userText: string,
  characterNamesById: Record<CharacterId, string>,
  random: () => number
): CharacterId[] => {
  const unmuted = members.filter((m) => !m.muted);
  if (unmuted.length === 0) return [];

  const textLower = userText.toLowerCase();

  const scored = unmuted.map((member) => {
    let score = 10;
    if (mentioned.includes(member.characterId)) score += 100;
    else if (textLower.includes((characterNamesById[member.characterId] ?? "").toLowerCase())) {
      score += 40;
    }

    const recentIndex = recentSpeakerIds.lastIndexOf(member.characterId);
    if (recentIndex !== -1) {
      const positionWeight = recentSpeakerIds.length - recentIndex;
      score -= 15 * positionWeight;
    }

    return { characterId: member.characterId, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const speakerCount = 1 + Math.floor(random() * 2); // 1 or 2
  const picked = scored.slice(0, speakerCount).map((s) => s.characterId);

  // A mentioned member is guaranteed to be included and lead the list.
  const mentionedUnmuted = mentioned.filter((id) => unmuted.some((m) => m.characterId === id));
  const rest = picked.filter((id) => !mentionedUnmuted.includes(id));
  return [...mentionedUnmuted, ...rest].slice(0, speakerCount);
};

const scheduleManual = (members: ChatRoomMember[], mentioned: CharacterId[]): CharacterId[] =>
  mentioned.filter((id) => members.some((m) => m.characterId === id && !m.muted));

export const scheduleTurn = ({
  members,
  turnMode,
  lastSpeakerOrder,
  userText,
  characterNamesById,
  recentSpeakerIds,
  random = Math.random,
}: ScheduleTurnArgs): CharacterId[] => {
  const mentioned = parseMentions(userText, characterNamesById);

  if (turnMode === "round-robin") {
    return scheduleRoundRobin(members, lastSpeakerOrder);
  }
  if (turnMode === "manual") {
    return scheduleManual(members, mentioned);
  }
  return scheduleNatural(
    members,
    mentioned,
    recentSpeakerIds,
    userText,
    characterNamesById,
    random
  );
};

export interface GroupTransitionPool {
  [locale: string]: string[];
}

// Returns a transition phrase (e.g. "{{name}} has a point, though—") for a
// non-first speaker in a group turn, so consecutive replies read as members
// talking to each other rather than independently.
export const getGroupTransition = (
  pool: string[],
  previousSpeakerName: string,
  random: () => number = Math.random
): string => {
  if (pool.length === 0) return "";
  const template = pool[Math.floor(random() * pool.length)];
  return template.replace("{{name}}", previousSpeakerName);
};
