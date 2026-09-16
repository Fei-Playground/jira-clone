import { useEffect, useRef, useState } from "react";
import cx from "classix";
import { RiSendPlaneFill, RiHistoryLine, RiEditLine } from "react-icons/ri";
import { Character } from "@domain/character";
import { ChatSession } from "@domain/chat-message";
import { ScrollArea } from "@app/components/scroll-area";
import { Tooltip } from "@app/components/tooltip";
import { formatDateTime } from "@utils/formatDateTime";
import { useTranslation } from "@app/store/locale.store";
import { Locale } from "@app/locales";
import { useCompanionsStore } from "../companions.store";

export const ChatWindow = ({
  character,
  session,
  onOpenHistory,
  onEditCharacter,
}: ChatWindowProps): JSX.Element => {
  const { sendMessage, settings } = useCompanionsStore();
  const { t, locale } = useTranslation();
  const [draft, setDraft] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = session?.messages ?? [];
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  useEffect(() => {
    if (lastMessage?.sender === "character") {
      const timeout = setTimeout(() => setIsTyping(false), 0);
      return () => clearTimeout(timeout);
    }
  }, [lastMessage]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || !session) return;
    sendMessage(trimmed);
    setDraft("");
    setIsTyping(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <CharacterAvatar character={character} size={44} />
          <div>
            <p className="font-primary-bold text-font">{character.name}</p>
            <p className="line-clamp-1 text-xs text-font-subtlest">
              {character.tagline}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip title={t("companions.chatWindow.editCompanion")}>
            <button
              onClick={onEditCharacter}
              aria-label={t("companions.chatWindow.editCompanion")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiEditLine size={18} />
            </button>
          </Tooltip>
          <Tooltip title={t("companions.chatWindow.conversationHistory")}>
            <button
              onClick={onOpenHistory}
              aria-label={t("companions.chatWindow.openConversationHistory")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiHistoryLine size={18} />
            </button>
          </Tooltip>
        </div>
      </header>

      <div className="min-h-0 flex-1 px-6">
        <ScrollArea>
          <div className="flex flex-col gap-4 py-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                text={message.text}
                createdAt={message.createdAt}
                isUser={message.sender === "user"}
                character={character}
                userDisplayName={settings.userDisplayName}
                locale={locale}
              />
            ))}
            {isTyping && <TypingIndicator character={character} />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-end gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("companions.chatWindow.messagePlaceholder", {
              name: character.name,
            })}
            rows={1}
            aria-label={t("companions.chatWindow.messageInput")}
            className={cx(
              "box-border max-h-40 min-h-[44px] w-full resize-none rounded-md border-none bg-background-input p-3",
              "font-primary text-sm outline outline-2 outline-border-input",
              "hover:bg-background-input-hovered focus:bg-background-input-pressed focus:outline-border-brand"
            )}
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label={t("companions.chatWindow.sendMessage")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background-brand-bold text-font-inverse hover:bg-background-brand-bold-hovered disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RiSendPlaneFill size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CharacterAvatar = ({
  character,
  size = 32,
}: {
  character: Character;
  size?: number;
}): JSX.Element => (
  <span
    className="flex shrink-0 items-center justify-center rounded-full text-base shadow-sm ring-2 ring-white/20"
    style={{
      width: size,
      height: size,
      background: `linear-gradient(145deg, ${character.avatarColor}, ${character.avatarColor}cc)`,
    }}
  >
    {character.avatarEmoji}
  </span>
);

const UserAvatarBubble = ({
  displayName,
  size = 32,
}: {
  displayName: string;
  size?: number;
}): JSX.Element => (
  <span
    className="flex shrink-0 items-center justify-center rounded-full font-primary-bold text-sm text-font-inverse shadow-sm"
    style={{
      width: size,
      height: size,
      background:
        "linear-gradient(145deg, var(--color-background-brand-bold), var(--color-background-brand-boldest))",
    }}
  >
    {displayName.slice(0, 1).toUpperCase()}
  </span>
);

const MessageBubble = ({
  text,
  createdAt,
  isUser,
  character,
  userDisplayName,
  locale,
}: {
  text: string;
  createdAt: number;
  isUser: boolean;
  character: Character;
  userDisplayName: string;
  locale: Locale;
}): JSX.Element => (
  <div className={cx("flex items-end gap-2.5", isUser && "flex-row-reverse")}>
    {isUser ? (
      <UserAvatarBubble displayName={userDisplayName} />
    ) : (
      <CharacterAvatar character={character} />
    )}
    <div
      className={cx(
        "max-w-[65%] px-4 py-2.5 text-sm shadow-sm",
        isUser
          ? "rounded-2xl rounded-br-md bg-gradient-to-br from-background-brand-bold to-background-brand-boldest text-font-inverse"
          : "rounded-2xl rounded-bl-md border border-border bg-elevation-surface-raised text-font"
      )}
    >
      <p className="whitespace-pre-wrap font-primary leading-6">{text}</p>
      <p
        className={cx(
          "mt-1 text-2xs",
          isUser ? "text-font-inverse opacity-70" : "text-font-subtlest"
        )}
      >
        {formatDateTime(createdAt, locale)}
      </p>
    </div>
  </div>
);

const TypingIndicator = ({
  character,
}: {
  character: Character;
}): JSX.Element => (
  <div className="flex items-end gap-2.5">
    <CharacterAvatar character={character} />
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-elevation-surface-raised px-4 py-3 shadow-sm">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-font-subtlest" />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-font-subtlest"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-font-subtlest"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

interface ChatWindowProps {
  character: Character;
  session: ChatSession | undefined;
  onOpenHistory: () => void;
  onEditCharacter: () => void;
}
