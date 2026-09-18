import { LoreInjectionSnapshot } from "@domain/chat-message";

export interface HighlightSegment {
  text: string;
  entryId?: string;
  entryName?: string;
}

interface KeywordSpan {
  entryId: string;
  entryName: string;
  keyword: string;
  start: number;
  end: number;
}

// Splits a message's text into alternating plain / matched-keyword segments,
// using the lore-injection snapshots stored on the message at send time —
// never re-running the matcher. This keeps highlighting consistent with
// history even if the underlying lorebook entries change later.
//
// No regex: keywords are free user input and may contain regex metachars
// (".", "(", "+", etc.), so scanning uses toLowerCase() + indexOf loops.
// Overlapping keywords are resolved by length (longest first) with an
// occupied-range table so e.g. "黑潮港" wins over "黑潮" and neither produces
// nested/duplicate <mark> ranges.
export const buildHighlightSegments = (
  text: string,
  injections: LoreInjectionSnapshot[] | undefined
): HighlightSegment[] => {
  if (!text || !injections || injections.length === 0) {
    return [{ text }];
  }

  const keywordEntries = injections.filter(
    (injection): injection is LoreInjectionSnapshot & { matchedKeyword: string } =>
      Boolean(injection.matchedKeyword && injection.matchedKeyword.trim())
  );

  if (keywordEntries.length === 0) {
    return [{ text }];
  }

  const textLower = text.toLowerCase();
  const occupied = new Array<boolean>(text.length).fill(false);
  const spans: KeywordSpan[] = [];

  // Longest keyword first, so a longer overlapping match claims its range
  // before a shorter substring keyword gets a chance to.
  const sortedEntries = [...keywordEntries].sort(
    (a, b) => b.matchedKeyword.length - a.matchedKeyword.length
  );

  for (const injection of sortedEntries) {
    const keywordLower = injection.matchedKeyword.toLowerCase();
    if (!keywordLower) continue;

    let searchFrom = 0;
    while (searchFrom <= textLower.length) {
      const foundAt = textLower.indexOf(keywordLower, searchFrom);
      if (foundAt === -1) break;

      const end = foundAt + injection.matchedKeyword.length;
      const rangeIsFree = !occupied.slice(foundAt, end).some(Boolean);

      if (rangeIsFree) {
        for (let i = foundAt; i < end; i++) occupied[i] = true;
        spans.push({
          entryId: injection.entryId,
          entryName: injection.entryName,
          keyword: injection.matchedKeyword,
          start: foundAt,
          end,
        });
      }

      searchFrom = foundAt + 1;
    }
  }

  if (spans.length === 0) {
    return [{ text }];
  }

  spans.sort((a, b) => a.start - b.start);

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start > cursor) {
      segments.push({ text: text.slice(cursor, span.start) });
    }
    segments.push({
      text: text.slice(span.start, span.end),
      entryId: span.entryId,
      entryName: span.entryName,
    });
    cursor = span.end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments;
};
