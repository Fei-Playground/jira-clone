import { Fragment, useMemo } from "react";
import { useProjectStore } from "@app/ui/main/project";

interface MessagePart {
  text: string;
  mention: boolean;
}

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const splitByMentions = (message: string, names: string[]): MessagePart[] => {
  if (names.length === 0) return [{ text: message, mention: false }];

  // Longest names first so multi-word mentions match before their prefixes
  const sortedNames = [...names].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `@(${sortedNames.map(escapeRegExp).join("|")})(?!\\w)`,
    "g"
  );

  const parts: MessagePart[] = [];
  let lastIndex = 0;

  for (const match of message.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ text: message.slice(lastIndex, index), mention: false });
    }
    parts.push({ text: match[0], mention: true });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < message.length) {
    parts.push({ text: message.slice(lastIndex), mention: false });
  }

  return parts;
};

export const MessageWithMentions = ({
  message,
}: MessageWithMentionsProps): JSX.Element => {
  const { project } = useProjectStore();

  const parts = useMemo(
    () =>
      splitByMentions(
        message,
        project.users.map((user) => user.name)
      ),
    [message, project.users]
  );

  return (
    <>
      {parts.map((part, index) =>
        part.mention ? (
          <span key={index} className="font-primary-bold text-font-brand">
            {part.text}
          </span>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        )
      )}
    </>
  );
};

interface MessageWithMentionsProps {
  message: string;
}
