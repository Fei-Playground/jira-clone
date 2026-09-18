import { Lorebook, LorebookEntry } from "./lorebook";

export type MatchSource = "constant" | "keyword";

export interface MatchedEntry {
  entry: LorebookEntry;
  matchedKeyword: string | null;
  source: MatchSource;
}

interface MatchLorebookEntriesArgs {
  lorebooks: Lorebook[];
  text: string;
  recentMessages: string[];
  maxEntries?: number;
  scanDepth?: number;
}

// Scans the current input plus the last `scanDepth` messages for any
// lorebook entry's keywords (case-insensitive substring match — Chinese
// substrings match natively, no tokenizer needed). `constant` entries always
// match. Results are ordered constant-first, then by descending priority,
// and capped at `maxEntries`.
export const matchLorebookEntries = ({
  lorebooks,
  text,
  recentMessages,
  maxEntries = 3,
  scanDepth = 4,
}: MatchLorebookEntriesArgs): MatchedEntry[] => {
  const scanWindow = [text, ...recentMessages.slice(-scanDepth)];
  const haystack = scanWindow.join("\n");
  const haystackLower = haystack.toLowerCase();

  const enabledEntries = lorebooks.flatMap((book) => book.entries.filter((entry) => entry.enabled));

  const matched: MatchedEntry[] = [];

  for (const entry of enabledEntries) {
    if (entry.constant) {
      matched.push({ entry, matchedKeyword: null, source: "constant" });
      continue;
    }

    const hitKeyword = entry.keywords.find((keyword) => {
      if (!keyword.trim()) return false;
      if (entry.caseSensitive) return haystack.includes(keyword);
      return haystackLower.includes(keyword.toLowerCase());
    });

    if (hitKeyword) {
      matched.push({ entry, matchedKeyword: hitKeyword, source: "keyword" });
    }
  }

  return matched
    .sort((a, b) => {
      if (a.source !== b.source) return a.source === "constant" ? -1 : 1;
      return b.entry.priority - a.entry.priority;
    })
    .slice(0, maxEntries);
};
