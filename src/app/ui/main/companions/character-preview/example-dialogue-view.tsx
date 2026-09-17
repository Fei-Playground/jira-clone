import { Character } from "@domain/character";

interface ParsedLine {
  speaker: "user" | "char";
  text: string;
}

const LINE_PATTERN = /^\s*[<{]{1,2}(user|char)[>}]{1,2}\s*:\s*(.*)$/i;

const parseExampleDialogue = (raw: string): ParsedLine[] | null => {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed: ParsedLine[] = [];
  for (const line of lines) {
    const match = line.match(LINE_PATTERN);
    if (!match) continue;
    const speaker = match[1].toLowerCase() === "user" ? "user" : "char";
    parsed.push({ speaker, text: match[2] });
  }

  // Only trust the parse if it found at least two alternating lines —
  // otherwise a free-form paragraph the user typed without the format
  // would get silently mangled into a single bubble.
  return parsed.length >= 2 ? parsed : null;
};

export const ExampleDialogueView = ({
  text,
  character,
}: {
  text: string;
  character: Character;
}): JSX.Element => {
  const parsed = parseExampleDialogue(text);

  if (!parsed) {
    return (
      <p className="font-mono whitespace-pre-wrap rounded-md bg-elevation-surface-sunken p-3 text-xs text-font-subtlest">
        {text}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {parsed.map((line, index) => (
        <div
          key={index}
          className={
            line.speaker === "user" ? "flex justify-end" : "flex justify-start"
          }
        >
          <div
            className={
              line.speaker === "user"
                ? "max-w-[75%] rounded-2xl rounded-br-md bg-gradient-to-br from-background-brand-bold to-background-brand-boldest px-3 py-2 text-sm text-font-inverse"
                : "max-w-[75%] rounded-2xl rounded-bl-md border border-border bg-elevation-surface-raised px-3 py-2 text-sm text-font"
            }
          >
            {line.speaker === "char" && (
              <p className="mb-0.5 text-2xs font-bold text-font-subtlest">
                {character.name}
              </p>
            )}
            <p className="whitespace-pre-wrap">{line.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
