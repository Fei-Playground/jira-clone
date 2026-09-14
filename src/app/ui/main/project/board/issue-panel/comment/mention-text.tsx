import { User } from "@domain/user";

/**
 * Renders a comment message with @mentions highlighted.
 *
 * Mentions are matched first against the given users (longest name wins, so
 * multi-word names like "Andy Davis" highlight fully), with a fallback
 * "@token" regex so mentions still highlight when no user matches.
 */
export const renderMessageWithMentions = (
  message: string,
  users: User[] = []
): JSX.Element => {
  type Pattern = { user?: User; regex: RegExp };
  const patterns: Pattern[] = users
    .map((user) => ({ user, regex: mentionRegexFor(user.name) }))
    .sort((a, b) => (b.user?.name.length ?? 0) - (a.user?.name.length ?? 0));
  patterns.push({ user: undefined, regex: genericMentionRegex });

  const segments: JSX.Element[] = [];
  let rest = message;
  let key = 0;

  while (rest.length > 0) {
    let matched: {
      pre: string;
      mention: string;
      user?: User;
    } | null = null;

    for (const { user, regex } of patterns) {
      const match = regex.exec(rest);
      if (!match) continue;
      const mention = match[0];
      const pre = rest.slice(0, match.index);
      matched = { pre, mention, user: user as User | undefined };
      break;
    }

    if (!matched) {
      segments.push(<span key={key++}>{rest}</span>);
      break;
    }

    const { pre, mention } = matched;
    if (pre) {
      segments.push(<span key={key++}>{pre}</span>);
    }

    segments.push(
      <span
        key={key++}
        className="rounded bg-background-brand-subtlest px-1 font-primary-bold text-font-brand"
        title={matched.user ? `Mentioned: ${matched.user.name}` : undefined}
      >
        {mention}
      </span>
    );

    rest = rest.slice(pre.length + mention.length);
  }

  return <>{segments}</>;
};

const mentionRegexFor = (name: string): RegExp =>
  new RegExp(`@${escapeRegex(name)}`);

const genericMentionRegex = /@[\w][\w-.]*/;

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
