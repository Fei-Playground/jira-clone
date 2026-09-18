import { useState } from "react";
import { Character } from "@domain/character";

// Finds the "@partial" fragment right before the cursor, if any (no space
// between the @ and the cursor). Returns null when there's no active
// mention trigger.
const findMentionQuery = (
  value: string,
  cursor: number
): { start: number; query: string } | null => {
  const uptoCursor = value.slice(0, cursor);
  const atIndex = uptoCursor.lastIndexOf("@");
  if (atIndex === -1) return null;
  const fragment = uptoCursor.slice(atIndex + 1);
  if (fragment.includes(" ") || fragment.includes("\n")) return null;
  return { start: atIndex, query: fragment };
};

export const useMentionAutocomplete = (
  value: string,
  cursor: number,
  characters: Character[]
) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const query = findMentionQuery(value, cursor);
  const matches = query
    ? characters.filter((c) =>
        c.name.toLowerCase().startsWith(query.query.toLowerCase())
      )
    : [];

  const isOpen = query !== null && matches.length > 0;

  const applyMention = (
    character: Character
  ): { newValue: string; newCursor: number } | null => {
    if (!query) return null;
    const before = value.slice(0, query.start);
    const after = value.slice(cursor);
    const insertion = `@${character.name} `;
    return {
      newValue: `${before}${insertion}${after}`,
      newCursor: before.length + insertion.length,
    };
  };

  return {
    isOpen,
    matches,
    highlightedIndex,
    setHighlightedIndex,
    applyMention,
  };
};

export const MentionAutocompleteList = ({
  matches,
  highlightedIndex,
  onSelect,
}: {
  matches: Character[];
  highlightedIndex: number;
  onSelect: (character: Character) => void;
}): JSX.Element => (
  <ul className="absolute bottom-full mb-1 w-full max-w-[240px] rounded-md border border-border bg-elevation-surface-overlay py-1 shadow-md">
    {matches.map((character, index) => (
      <li key={character.id}>
        <button
          onClick={() => onSelect(character)}
          className={
            index === highlightedIndex
              ? "flex w-full items-center gap-2 bg-background-selected px-3 py-1.5 text-left text-sm text-font-brand"
              : "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-font hover:bg-background-neutral"
          }
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
            style={{
              background: `linear-gradient(145deg, ${character.avatarColor}, ${character.avatarColor}cc)`,
            }}
          >
            {character.avatarEmoji}
          </span>
          {character.name}
        </button>
      </li>
    ))}
  </ul>
);
