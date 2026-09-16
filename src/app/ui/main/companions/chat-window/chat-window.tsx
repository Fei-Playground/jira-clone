import { useEffect, useRef, useState } from "react";
import cx from "classix";
import { RiSendPlaneFill, RiHistoryLine, RiEditLine } from "react-icons/ri";
import { Character } from "@domain/character";
import { ChatSession } from "@domain/chat-message";
import { ScrollArea } from "@app/components/scroll-area";
import { Tooltip } from "@app/components/tooltip";
import { formatDateTime } from "@utils/formatDateTime";
import { useCompanionsStore } from "../companions.store";

export const ChatWindow = ({
  character,
  session,
  onOpenHistory,
  onEditCharacter,
}: ChatWindowProps): JSX.Element => {
  const { sendMessage, settings } = useCompanionsStore();
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
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
            style={{ backgroundColor: character.avatarColor }}
          >
            {character.avatarEmoji}
          </span>
          <div>
            <p className="font-primary-bold text-font">{character.name}</p>
            <p className="line-clamp-1 text-xs text-font-subtlest">
              {character.tagline}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip title="Edit companion">
            <button
              onClick={onEditCharacter}
              aria-label="Edit companion"
              className="flex h-9 w-9 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiEditLine size={18} />
            </button>
          </Tooltip>
          <Tooltip title="Conversation history">
            <button
              onClick={onOpenHistory}
              aria-label="Open conversation history"
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
            placeholder={`Message ${character.name}...`}
            rows={1}
            aria-label="Message input"
            className={cx(
              "box-border max-h-40 min-h-[44px] w-full resize-none rounded-md border-none bg-background-input p-3",
              "font-primary text-sm outline outline-2 outline-border-input",
              "hover:bg-background-input-hovered focus:bg-background-input-pressed focus:outline-border-brand"
            )}
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background-brand-bold text-font-inverse hover:bg-background-brand-bold-hovered disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RiSendPlaneFill size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({
  text,
  createdAt,
  isUser,
  character,
  userDisplayName,
}: {
  text: string;
  createdAt: number;
  isUser: boolean;
  character: Character;
  userDisplayName: string;
}): JSX.Element => (
  <div className={cx("flex items-end gap-2", isUser && "flex-row-reverse")}>
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
      style={{
        backgroundColor: isUser
          ? "var(--color-background-neutral-bold)"
          : character.avatarColor,
      }}
    >
      {isUser
        ? userDisplayName.slice(0, 1).toUpperCase()
        : character.avatarEmoji}
    </span>
    <div
      className={cx(
        "max-w-[65%] rounded-lg px-4 py-2.5 text-sm",
        isUser
          ? "bg-background-brand-bold text-font-inverse"
          : "bg-elevation-surface-raised text-font shadow-xs"
      )}
    >
      <p className="whitespace-pre-wrap font-primary leading-6">{text}</p>
      <p
        className={cx(
          "mt-1 text-2xs",
          isUser ? "text-font-inverse opacity-70" : "text-font-subtlest"
        )}
      >
        {formatDateTime(createdAt)}
      </p>
    </div>
  </div>
);

const TypingIndicator = ({
  character,
}: {
  character: Character;
}): JSX.Element => (
  <div className="flex items-end gap-2">
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
      style={{ backgroundColor: character.avatarColor }}
    >
      {character.avatarEmoji}
    </span>
    <div className="flex items-center gap-1 rounded-lg bg-elevation-surface-raised px-4 py-3 shadow-xs">
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
