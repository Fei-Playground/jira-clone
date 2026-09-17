import { Character, CharacterImage } from "./character";
import { Lorebook } from "@domain/lorebook";

export const CHARACTER_CARD_SPEC = "companion_card_v1" as const;

const MAX_STRING_LENGTH = 4000;
const MAX_TAGS = 20;

export type CharacterCardData = Omit<Character, "id" | "createdAt" | "isCustom"> & {
  lorebooks?: Lorebook[];
};

export interface CharacterCard {
  spec: typeof CHARACTER_CARD_SPEC;
  version: number;
  data: CharacterCardData;
}

export type CardImportErrorReason = "invalid_json" | "unrecognized_spec" | "missing_name";

export interface CardImportError {
  error: CardImportErrorReason;
}

export interface CardImportSuccess {
  character: Omit<Character, "id" | "createdAt">;
  lorebooks: Lorebook[];
}

const truncate = (value: string): string => value.slice(0, MAX_STRING_LENGTH);

export const toCharacterCard = (
  character: Character,
  lorebooks: Lorebook[] = []
): CharacterCard => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, isCustom, ...data } = character;
  return {
    spec: CHARACTER_CARD_SPEC,
    version: character.cardVersion ?? 1,
    data: { ...data, lorebooks: lorebooks.length > 0 ? lorebooks : undefined },
  };
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const sanitizeImages = (raw: unknown): CharacterImage[] | undefined => {
  if (!Array.isArray(raw)) return undefined;
  const images = raw
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" &&
        item !== null &&
        isNonEmptyString((item as Record<string, unknown>).url)
    )
    .map((item, index) => ({
      id: isNonEmptyString(item.id) ? (item.id as string) : `imported-${index}`,
      url: item.url as string,
      caption: isNonEmptyString(item.caption) ? (item.caption as string) : undefined,
      isPrimary: Boolean(item.isPrimary),
    }));
  return images.length > 0 ? images : undefined;
};

const sanitizeTags = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isNonEmptyString).slice(0, MAX_TAGS).map(truncate);
};

// Parses an arbitrary parsed-JSON value into a character + optional
// lorebooks. Unknown/extra fields are ignored; missing optional fields fall
// back to sensible defaults so a hand-edited or partial JSON still imports.
export const fromCharacterCard = (raw: unknown): CardImportSuccess | CardImportError => {
  if (typeof raw !== "object" || raw === null) {
    return { error: "invalid_json" };
  }

  const card = raw as Record<string, unknown>;
  if (card.spec !== CHARACTER_CARD_SPEC) {
    return { error: "unrecognized_spec" };
  }

  const data = card.data as Record<string, unknown> | undefined;
  if (!data || !isNonEmptyString(data.name)) {
    return { error: "missing_name" };
  }

  const character: Omit<Character, "id" | "createdAt"> = {
    name: truncate(data.name as string),
    tagline: isNonEmptyString(data.tagline) ? truncate(data.tagline as string) : "",
    personality: isNonEmptyString(data.personality) ? truncate(data.personality as string) : "",
    scenario: isNonEmptyString(data.scenario) ? truncate(data.scenario as string) : "",
    greeting: isNonEmptyString(data.greeting) ? truncate(data.greeting as string) : "",
    avatarColor: isNonEmptyString(data.avatarColor) ? (data.avatarColor as string) : "#3b2f7a",
    avatarEmoji: isNonEmptyString(data.avatarEmoji) ? (data.avatarEmoji as string) : "🎭",
    tags: sanitizeTags(data.tags),
    isCustom: true,
    appearance: isNonEmptyString(data.appearance) ? truncate(data.appearance as string) : undefined,
    speechStyle: isNonEmptyString(data.speechStyle)
      ? truncate(data.speechStyle as string)
      : undefined,
    initialRelationship: isNonEmptyString(data.initialRelationship)
      ? truncate(data.initialRelationship as string)
      : undefined,
    exampleDialogue: isNonEmptyString(data.exampleDialogue)
      ? truncate(data.exampleDialogue as string)
      : undefined,
    images: sanitizeImages(data.images),
    defaultAuthorNote: isNonEmptyString(data.defaultAuthorNote)
      ? truncate(data.defaultAuthorNote as string)
      : undefined,
    creatorNotes: isNonEmptyString(data.creatorNotes)
      ? truncate(data.creatorNotes as string)
      : undefined,
    cardVersion: typeof card.version === "number" ? card.version : 1,
  };

  const lorebooks = Array.isArray(data.lorebooks)
    ? (data.lorebooks as Lorebook[]).filter(
        (book) => book && isNonEmptyString(book.name) && Array.isArray(book.entries)
      )
    : [];

  return { character, lorebooks };
};
