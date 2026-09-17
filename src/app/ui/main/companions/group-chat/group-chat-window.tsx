import { useEffect, useRef, useState } from "react";
import cx from "classix";
import {
  RiSendPlaneFill,
  RiFileTextLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { Character, CharacterId } from "@domain/character";
import { ChatRoom } from "@domain/chat-room";
import { ChatMessage, LoreInjectionSnapshot } from "@domain/chat-message";
import { QuickAction } from "@domain/quick-action";
import { ScrollArea } from "@app/components/scroll-area";
import { Tooltip } from "@app/components/tooltip";
import { formatDateTime } from "@utils/formatDateTime";
import { useTranslation } from "@app/store/locale.store";
import { AuthorNotePanel } from "../author-note-panel";
import { LoreInjectionNotice } from "../lore-injection-notice";
import { HighlightedMessageText } from "../highlighted-message-text";
import { useCompanionsStore } from "../companions.store";
import { useChatRoomStore } from "../chat-room.store";
import { QuickActionBar } from "../quick-action-bar";
import { GroupMemberBar } from "./group-member-bar";
import {
  useMentionAutocomplete,
  MentionAutocompleteList,
} from "./mention-autocomplete";

export const GroupChatWindow = ({
  room,
  onDeleteRoom,
  onViewCharacter,
  quickActions,
}: {
  room: ChatRoom;
  onDeleteRoom: () => void;
  onViewCharacter: (characterId: CharacterId) => void;
  // Contextual "say this" chips shown above the input. Omitted for
  // free-standing group chat rooms (/companions) — only scene group chat
  // passes these.
  quickActions?: QuickAction[];
}): JSX.Element => {
  const { characters, settings } = useCompanionsStore();
  const {
    sendRoomMessage,
    toggleMemberMute,
    callOnMember,
    setRoomAuthorNote,
    pendingSpeakerIds,
    nextSpeakerId,
  } = useChatRoomStore();
  const { t, locale } = useTranslation();

  const [draft, setDraft] = useState("");
  const [cursor, setCursor] = useState(0);
  const [isAuthorNoteOpen, setIsAuthorNoteOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charactersById = characters.reduce<Record<CharacterId, Character>>(
    (acc, c) => {
      acc[c.id] = c;
      return acc;
    },
    {}
  );

  const memberCharacters = room.members
    .map((m) => charactersById[m.characterId])
    .filter((c): c is Character => Boolean(c));

  const mention = useMentionAutocomplete(draft, cursor, memberCharacters);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room.messages.length, pendingSpeakerIds.length]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    sendRoomMessage(room.id, trimmed);
    setDraft("");
    setCursor(0);
  };

  // Quick-action chips send through the exact same path as typing + hitting
  // send, so quest progress / lore injection / highlighting stay intact.
  const handleQuickSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendRoomMessage(room.id, trimmed);
  };

  // Inserts text at the current cursor position (not the end of the
  // draft) — important for "@member" chips so mentioning someone mid-
  // sentence doesn't relocate the caret and confuse the mention
  // autocomplete that's watching `cursor`.
  const handleQuickFill = (text: string) => {
    const before = draft.slice(0, cursor);
    const after = draft.slice(cursor);
    const nextValue = `${before}${text}${after}`;
    setDraft(nextValue);
    setCursor(before.length + text.length);
  };

  // "@member" chips, one per room member, placed BEFORE any caller-supplied
  // quickActions so they aren't pushed into the overflow menu by
  // QuickActionBar's VISIBLE_COUNT cap — mentioning someone is the most
  // group-chat-specific action and shouldn't require an extra click to
  // reach. `alwaysFill` makes clicking ALWAYS insert at the cursor rather
  // than send, both as a visible chip and from the overflow menu.
  const mentionChipActions: QuickAction[] = memberCharacters.map((c) => ({
    id: `mention:${c.id}`,
    label: `@${c.name}`,
    text: `@${c.name} `,
    source: "generic" as const,
    alwaysFill: true,
  }));
  const allQuickActions = quickActions
    ? [...mentionChipActions, ...quickActions]
    : undefined;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (mention.isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        mention.setHighlightedIndex((i) => (i + 1) % mention.matches.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        mention.setHighlightedIndex(
          (i) => (i - 1 + mention.matches.length) % mention.matches.length
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const chosen = mention.matches[mention.highlightedIndex];
        if (chosen) {
          const result = mention.applyMention(chosen);
          if (result) {
            setDraft(result.newValue);
            setCursor(result.newCursor);
          }
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey && !mention.isOpen) {
      e.preventDefault();
      handleSend();
    }
  };

  const nextSpeakerName = nextSpeakerId
    ? charactersById[nextSpeakerId]?.name
    : undefined;
  const isTyping = pendingSpeakerIds.length > 0;
  const typingCharacter = isTyping
    ? charactersById[pendingSpeakerIds[0]]
    : undefined;

  return (
    <div className="flex h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="font-primary-bold text-font">{room.name}</p>
          <p className="text-xs text-font-subtlest">
            {room.members.length} ·{" "}
            {t(
              `companions.group.turnMode${capitalize(room.turnMode)}` as never
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip title={t("companions.authorNote.openPanel")}>
            <button
              onClick={() => setIsAuthorNoteOpen(true)}
              aria-label={t("companions.authorNote.openPanel")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiFileTextLine size={18} />
              {room.authorNote?.text && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-background-brand-bold" />
              )}
            </button>
          </Tooltip>
          <Tooltip title={t("companions.group.deleteRoom")}>
            <button
              onClick={onDeleteRoom}
              aria-label={t("companions.group.deleteRoom")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-icon hover:bg-background-danger-hovered hover:text-font-danger"
            >
              <RiDeleteBinLine size={18} />
            </button>
          </Tooltip>
        </div>
      </header>

      <GroupMemberBar
        members={room.members}
        charactersById={charactersById}
        onToggleMute={(characterId) => toggleMemberMute(room.id, characterId)}
        onCallOn={(characterId) => callOnMember(room.id, characterId)}
        onViewCard={onViewCharacter}
      />

      <div className="min-h-0 flex-1 px-6">
        <ScrollArea>
          <div className="flex flex-col gap-4 py-6">
            {room.messages.map((message) => (
              <GroupMessage
                key={message.id}
                message={message}
                character={
                  message.senderCharacterId
                    ? charactersById[message.senderCharacterId]
                    : undefined
                }
                userDisplayName={settings.userDisplayName}
                locale={locale}
              />
            ))}
            {isTyping && typingCharacter && (
              <GroupTypingIndicator character={typingCharacter} />
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-border p-4">
        {room.turnMode === "round-robin" && nextSpeakerName && (
          <p className="mb-2 animate-pulse text-xs text-font-subtlest">
            {t("companions.group.nextSpeaker", { name: nextSpeakerName })}
          </p>
        )}
        {room.turnMode === "manual" && (
          <p className="mb-2 text-xs text-font-subtlest">
            {t("companions.group.mentionHint")}
          </p>
        )}
        {allQuickActions && (
          <QuickActionBar
            actions={allQuickActions}
            onSend={handleQuickSend}
            onFill={handleQuickFill}
          />
        )}
        <div className="relative flex items-end gap-3">
          {mention.isOpen && (
            <MentionAutocompleteList
              matches={mention.matches}
              highlightedIndex={mention.highlightedIndex}
              onSelect={(character) => {
                const result = mention.applyMention(character);
                if (result) {
                  setDraft(result.newValue);
                  setCursor(result.newCursor);
                  textareaRef.current?.focus();
                }
              }}
            />
          )}
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setCursor(e.target.selectionStart ?? e.target.value.length);
            }}
            onKeyUp={(e) => setCursor(e.currentTarget.selectionStart ?? 0)}
            onClick={(e) => setCursor(e.currentTarget.selectionStart ?? 0)}
            onKeyDown={handleKeyDown}
            placeholder={t("companions.group.messagePlaceholder")}
            rows={1}
            aria-label={t("companions.group.messagePlaceholder")}
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

      <AuthorNotePanel
        key={room.id}
        isOpen={isAuthorNoteOpen}
        authorNote={room.authorNote}
        onClose={() => setIsAuthorNoteOpen(false)}
        onSave={(note) => setRoomAuthorNote(room.id, note)}
        onClear={() => setRoomAuthorNote(room.id, undefined)}
      />
    </div>
  );
};

const capitalize = (mode: string): string =>
  mode
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const GroupMessage = ({
  message,
  character,
  userDisplayName,
  locale,
}: {
  message: ChatMessage;
  character: Character | undefined;
  userDisplayName: string;
  locale: string;
}): JSX.Element => {
  const isUser = message.sender === "user";

  if (message.sender === "system") {
    return (
      <div className="flex items-center justify-center">
        <p className="rounded-full border border-dashed border-border px-3 py-1 text-2xs text-font-subtlest">
          {message.text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {isUser &&
        message.loreInjections &&
        message.loreInjections.length > 0 && (
          <div className="flex justify-end">
            <LoreInjectionNotice injections={message.loreInjections} />
          </div>
        )}
      <div
        className={cx("flex items-end gap-2.5", isUser && "flex-row-reverse")}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base shadow-sm"
          style={{
            background: isUser
              ? "linear-gradient(145deg, var(--color-background-brand-bold), var(--color-background-brand-boldest))"
              : `linear-gradient(145deg, ${character?.avatarColor ?? "#666"}, ${character?.avatarColor ?? "#666"}cc)`,
          }}
        >
          {isUser
            ? userDisplayName.slice(0, 1).toUpperCase()
            : (character?.avatarEmoji ?? "?")}
        </span>
        <div
          className={cx(
            "max-w-[65%] px-4 py-2.5 text-sm shadow-sm",
            isUser
              ? "rounded-2xl rounded-br-md bg-gradient-to-br from-background-brand-bold to-background-brand-boldest text-font-inverse"
              : "rounded-2xl rounded-bl-md border-l-[3px] bg-elevation-surface-raised text-font"
          )}
          style={
            !isUser ? { borderLeftColor: character?.avatarColor } : undefined
          }
        >
          {!isUser && character && (
            <p
              className="mb-0.5 text-2xs font-bold"
              style={{ color: character.avatarColor }}
            >
              {character.name}
            </p>
          )}
          <p className="whitespace-pre-wrap font-primary leading-6">
            <HighlightedMessageText
              text={message.text}
              injections={
                message.loreInjections as LoreInjectionSnapshot[] | undefined
              }
              isUser={isUser}
            />
          </p>
          <p
            className={cx(
              "mt-1 text-2xs",
              isUser ? "text-font-inverse opacity-70" : "text-font-subtlest"
            )}
          >
            {formatDateTime(message.createdAt, locale)}
          </p>
        </div>
      </div>
    </div>
  );
};

const GroupTypingIndicator = ({
  character,
}: {
  character: Character;
}): JSX.Element => (
  <div className="flex items-end gap-2.5">
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
      style={{
        background: `linear-gradient(145deg, ${character.avatarColor}, ${character.avatarColor}cc)`,
      }}
    >
      {character.avatarEmoji}
    </span>
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
