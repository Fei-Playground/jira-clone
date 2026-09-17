import { useEffect, useRef, useState } from "react";
import cx from "classix";
import {
  RiSendPlaneFill,
  RiHistoryLine,
  RiEditLine,
  RiFileTextLine,
} from "react-icons/ri";
import { Character } from "@domain/character";
import { ChatSession, LoreInjectionSnapshot } from "@domain/chat-message";
import { QuickAction } from "@domain/quick-action";
import { ScrollArea } from "@app/components/scroll-area";
import { Tooltip } from "@app/components/tooltip";
import { formatDateTime } from "@utils/formatDateTime";
import { useTranslation } from "@app/store/locale.store";
import { Locale } from "@app/locales";
import { useCompanionsStore } from "../companions.store";
import { AuthorNotePanel } from "../author-note-panel";
import { LoreInjectionNotice } from "../lore-injection-notice";
import { HighlightedMessageText } from "../highlighted-message-text";
import { QuickActionBar } from "../quick-action-bar";

export const ChatWindow = ({
  character,
  session,
  onOpenHistory,
  onEditCharacter,
  onOpenPreview,
  onSendOverride,
  quickActions,
}: ChatWindowProps): JSX.Element => {
  const { sendMessage, settings, setAuthorNote } = useCompanionsStore();
  const { t, locale } = useTranslation();
  const [draft, setDraft] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isAuthorNoteOpen, setIsAuthorNoteOpen] = useState(false);
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
    if (onSendOverride) {
      onSendOverride(trimmed);
    } else {
      sendMessage(trimmed);
    }
    setDraft("");
    setIsTyping(true);
  };

  // A quick-action chip's "send" click must walk the EXACT same path as
  // typing + hitting send — otherwise quest progress / lore injection /
  // keyword highlighting silently stop working for anything sent via a
  // chip. It intentionally does not go through `draft` state at all.
  const handleQuickSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !session) return;
    if (onSendOverride) {
      onSendOverride(trimmed);
    } else {
      sendMessage(trimmed);
    }
    setIsTyping(true);
  };

  const handleQuickFill = (text: string) => {
    setDraft((prev) => (prev ? `${prev} ${text}` : text));
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
        <button
          onClick={onOpenPreview}
          aria-label={t("companions.preview.openPreview", {
            name: character.name,
          })}
          className="flex items-center gap-3 rounded p-1 text-left hover:bg-background-neutral"
        >
          <CharacterAvatar character={character} size={44} />
          <div>
            <p className="font-primary-bold text-font">{character.name}</p>
            <p className="line-clamp-1 text-xs text-font-subtlest">
              {character.tagline}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <Tooltip title={t("companions.authorNote.openPanel")}>
            <button
              onClick={() => setIsAuthorNoteOpen(true)}
              aria-label={t("companions.authorNote.openPanel")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiFileTextLine size={18} />
              {session?.authorNote?.text && (
                <span
                  aria-label={t("companions.authorNote.activeIndicator")}
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-background-brand-bold"
                />
              )}
            </button>
          </Tooltip>
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
              <div key={message.id} className="flex flex-col gap-1">
                {message.sender === "user" &&
                  message.loreInjections &&
                  message.loreInjections.length > 0 && (
                    <div className="flex justify-end">
                      <LoreInjectionNotice
                        injections={message.loreInjections}
                      />
                    </div>
                  )}
                <MessageBubble
                  text={message.text}
                  createdAt={message.createdAt}
                  isUser={message.sender === "user"}
                  character={character}
                  userDisplayName={settings.userDisplayName}
                  locale={locale}
                  injections={message.loreInjections}
                />
              </div>
            ))}
            {isTyping && <TypingIndicator character={character} />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-border p-4">
        {quickActions && (
          <QuickActionBar
            actions={quickActions}
            onSend={handleQuickSend}
            onFill={handleQuickFill}
          />
        )}
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

      {session && (
        <AuthorNotePanel
          key={session.id}
          isOpen={isAuthorNoteOpen}
          authorNote={session.authorNote}
          onClose={() => setIsAuthorNoteOpen(false)}
          onSave={(note) => setAuthorNote(session.id, note)}
          onClear={() => setAuthorNote(session.id, undefined)}
        />
      )}
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
  injections,
}: {
  text: string;
  createdAt: number;
  isUser: boolean;
  character: Character;
  userDisplayName: string;
  locale: Locale;
  injections?: LoreInjectionSnapshot[];
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
      <p className="whitespace-pre-wrap font-primary leading-6">
        <HighlightedMessageText
          text={text}
          injections={injections}
          isUser={isUser}
        />
      </p>
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
  onOpenPreview: () => void;
  // When set, overrides the default companions-store sendMessage flow —
  // used by scene dialogue so a sent message advances quest/progress state
  // instead of the free-standing companion chat's scripted-reply flow.
  onSendOverride?: (text: string) => void;
  // Contextual "say this" chips shown above the input. Omitted entirely by
  // the free-standing companion chat (/companions) — only scene dialogue
  // passes these, so nothing changes for existing free-chat behaviour.
  quickActions?: QuickAction[];
}
