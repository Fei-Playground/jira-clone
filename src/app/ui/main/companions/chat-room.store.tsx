import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { v4 as uuid } from "uuid";
import { CharacterId } from "@domain/character";
import {
  ChatRoom,
  ChatRoomId,
  TurnMode,
  scheduleTurn,
  getGroupTransition,
} from "@domain/chat-room";
import {
  chatRoomsMock,
  getRoomText,
  groupTransitionByLocale,
} from "@domain/chat-room";
import { LorebookId } from "@domain/lorebook";
import {
  ChatMessage,
  LoreInjectionSnapshot,
  createUserMessage,
  getScriptedReply,
} from "@domain/chat-message";
import { useTranslation } from "@app/store/locale.store";
import { useCompanionsStore } from "./companions.store";
import { useLorebookStore } from "./lorebook.store";

const NEW_CONVERSATION_TITLE_FALLBACK = "New room";

interface ChatRoomStore {
  rooms: ChatRoom[];
  activeRoomId: ChatRoomId | null;
  selectRoom: (roomId: ChatRoomId) => void;
  createRoom: (args: {
    name: string;
    characterIds: CharacterId[];
    turnMode: TurnMode;
    lorebookIds: LorebookId[];
    sceneId?: string;
  }) => ChatRoom;
  deleteRoom: (roomId: ChatRoomId) => void;
  updateRoom: (
    roomId: ChatRoomId,
    patch: Partial<Pick<ChatRoom, "name" | "turnMode" | "lorebookIds">>
  ) => void;
  toggleMemberMute: (roomId: ChatRoomId, characterId: CharacterId) => void;
  sendRoomMessage: (
    roomId: ChatRoomId,
    text: string,
    senderProfileId?: string
  ) => void;
  callOnMember: (roomId: ChatRoomId, characterId: CharacterId) => void;
  setRoomAuthorNote: (
    roomId: ChatRoomId,
    note: { text: string; depth: number; updatedAt: number } | undefined
  ) => void;
  pendingSpeakerIds: CharacterId[];
  nextSpeakerId: CharacterId | null;
}

const ChatRoomContext = createContext<ChatRoomStore | undefined>(undefined);

export const ChatRoomContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { locale } = useTranslation();
  const { characters } = useCompanionsStore();
  const { matchEntriesForText } = useLorebookStore();

  const [rooms, setRooms] = useState<ChatRoom[]>(chatRoomsMock);
  const [activeRoomId, setActiveRoomId] = useState<ChatRoomId | null>(
    chatRoomsMock[0]?.id ?? null
  );
  const [pendingSpeakerIds, setPendingSpeakerIds] = useState<CharacterId[]>([]);

  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearAllTimers = useCallback(() => {
    timerIds.current.forEach((id) => clearTimeout(id));
    timerIds.current = [];
  }, []);

  // Clean up any in-flight speaking timers on unmount so a deleted/left room
  // never gets a message written to it after the fact.
  useEffect(() => clearAllTimers, [clearAllTimers]);

  const localizedRooms = useMemo(
    () =>
      rooms.map((room) => {
        const localizedText = getRoomText(room.id, locale);
        if (!localizedText) return room;
        if (localizedText.messages.length !== room.messages.length) return room;
        return {
          ...room,
          name: localizedText.name,
          messages: room.messages.map((message, index) => ({
            ...message,
            text: localizedText.messages[index] ?? message.text,
          })),
        };
      }),
    [rooms, locale]
  );

  const characterNamesById = useMemo(
    () =>
      characters.reduce<Record<CharacterId, string>>((acc, c) => {
        acc[c.id] = c.name;
        return acc;
      }, {}),
    [characters]
  );

  const selectRoom = useCallback(
    (roomId: ChatRoomId) => {
      clearAllTimers();
      setPendingSpeakerIds([]);
      setActiveRoomId(roomId);
    },
    [clearAllTimers]
  );

  const createRoom = useCallback(
    (args: {
      name: string;
      characterIds: CharacterId[];
      turnMode: TurnMode;
      lorebookIds: LorebookId[];
      sceneId?: string;
    }): ChatRoom => {
      const newRoom: ChatRoom = {
        id: uuid(),
        name: args.name || NEW_CONVERSATION_TITLE_FALLBACK,
        turnMode: args.turnMode,
        lorebookIds: args.lorebookIds,
        members: args.characterIds.map((characterId, index) => ({
          characterId,
          muted: false,
          order: index,
        })),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        sceneId: args.sceneId,
      };
      setRooms((prev) => [...prev, newRoom]);
      setActiveRoomId(newRoom.id);
      return newRoom;
    },
    []
  );

  const deleteRoom = useCallback(
    (roomId: ChatRoomId) => {
      clearAllTimers();
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      setActiveRoomId((prev) => {
        if (prev !== roomId) return prev;
        return null;
      });
      setPendingSpeakerIds([]);
    },
    [clearAllTimers]
  );

  const updateRoom = useCallback(
    (
      roomId: ChatRoomId,
      patch: Partial<Pick<ChatRoom, "name" | "turnMode" | "lorebookIds">>
    ) => {
      setRooms((prev) =>
        prev.map((room) => (room.id === roomId ? { ...room, ...patch } : room))
      );
    },
    []
  );

  const toggleMemberMute = useCallback(
    (roomId: ChatRoomId, characterId: CharacterId) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? {
                ...room,
                members: room.members.map((m) =>
                  m.characterId === characterId ? { ...m, muted: !m.muted } : m
                ),
              }
            : room
        )
      );
    },
    []
  );

  const setRoomAuthorNote = useCallback(
    (
      roomId: ChatRoomId,
      note: { text: string; depth: number; updatedAt: number } | undefined
    ) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, authorNote: note } : room
        )
      );
    },
    []
  );

  const advanceSpeakers = useCallback(
    (roomId: ChatRoomId, speakerIds: CharacterId[]) => {
      setPendingSpeakerIds(speakerIds);
      if (speakerIds.length === 0) return;

      let lastOrderInBatch: number | undefined;

      speakerIds.forEach((characterId, index) => {
        const delay = index === 0 ? 0 : 700 + Math.random() * 500;
        const timerId = setTimeout(() => {
          setRooms((prev) =>
            prev.map((room) => {
              if (room.id !== roomId) return room;

              const member = room.members.find(
                (m) => m.characterId === characterId
              );
              if (member) lastOrderInBatch = member.order;

              const speakerCountSoFar = room.messages.filter(
                (m) => m.senderCharacterId === characterId
              ).length;
              let replyText = getScriptedReply(
                characterId,
                speakerCountSoFar,
                locale
              );

              if (index > 0) {
                const prevSpeakerId = speakerIds[index - 1];
                const prevSpeakerName = characterNamesById[prevSpeakerId] ?? "";
                const transitionPool = groupTransitionByLocale[locale] ?? [];
                const transition = getGroupTransition(
                  transitionPool,
                  prevSpeakerName
                );
                if (transition) replyText = `${transition} ${replyText}`;
              }

              if (room.authorNote?.text) {
                replyText = `(${room.authorNote.text.slice(0, 24)}…) ${replyText}`;
              }

              const newMessage: ChatMessage = {
                id: uuid(),
                sender: "character",
                senderCharacterId: characterId,
                text: replyText,
                createdAt: Date.now(),
              };

              return {
                ...room,
                messages: [...room.messages, newMessage],
                updatedAt: Date.now(),
                lastSpeakerOrder:
                  index === speakerIds.length - 1
                    ? (lastOrderInBatch ?? room.lastSpeakerOrder)
                    : room.lastSpeakerOrder,
              };
            })
          );

          if (index === speakerIds.length - 1) {
            setPendingSpeakerIds([]);
          }
        }, delay);
        timerIds.current.push(timerId);
      });
    },
    [locale, characterNamesById]
  );

  const sendRoomMessage = useCallback(
    (roomId: ChatRoomId, text: string, senderProfileId?: string) => {
      const room = localizedRooms.find((r) => r.id === roomId);
      if (!room) return;

      const recentMessages = room.messages.slice(-6).map((m) => m.text);
      const matched =
        room.lorebookIds.length > 0
          ? matchEntriesForText({
              lorebookIds: room.lorebookIds,
              text,
              recentMessages,
            })
          : [];
      const loreInjections: LoreInjectionSnapshot[] = matched.map((m) => ({
        entryId: m.entry.id,
        entryName: m.entry.name,
        content: m.entry.content,
        matchedKeyword: m.matchedKeyword,
      }));

      const userMessage: ChatMessage = {
        ...createUserMessage(text),
        loreInjections: loreInjections.length > 0 ? loreInjections : undefined,
        senderProfileId,
      };

      setRooms((prev) =>
        prev.map((r) =>
          r.id === roomId
            ? {
                ...r,
                messages: [...r.messages, userMessage],
                updatedAt: Date.now(),
              }
            : r
        )
      );

      const recentSpeakerIds = room.messages
        .filter((m) => m.sender === "character" && m.senderCharacterId)
        .slice(-6)
        .map((m) => m.senderCharacterId as CharacterId);

      const speakerIds = scheduleTurn({
        members: room.members,
        turnMode: room.turnMode,
        lastSpeakerOrder: room.lastSpeakerOrder,
        userText: text,
        characterNamesById,
        recentSpeakerIds,
      });

      advanceSpeakers(roomId, speakerIds);
    },
    [localizedRooms, matchEntriesForText, characterNamesById, advanceSpeakers]
  );

  const callOnMember = useCallback(
    (roomId: ChatRoomId, characterId: CharacterId) => {
      advanceSpeakers(roomId, [characterId]);
    },
    [advanceSpeakers]
  );

  const activeRoom = localizedRooms.find((r) => r.id === activeRoomId);
  const nextSpeakerId = useMemo(() => {
    if (!activeRoom || activeRoom.turnMode !== "round-robin") return null;
    const unmuted = activeRoom.members.filter((m) => !m.muted);
    if (unmuted.length === 0) return null;
    const sorted = [...unmuted].sort((a, b) => a.order - b.order);
    const startAfter = activeRoom.lastSpeakerOrder ?? -Infinity;
    const next = sorted.find((m) => m.order > startAfter) ?? sorted[0];
    return next?.characterId ?? null;
  }, [activeRoom]);

  const value: ChatRoomStore = {
    rooms: localizedRooms,
    activeRoomId,
    selectRoom,
    createRoom,
    deleteRoom,
    updateRoom,
    toggleMemberMute,
    sendRoomMessage,
    callOnMember,
    setRoomAuthorNote,
    pendingSpeakerIds,
    nextSpeakerId,
  };

  return (
    <ChatRoomContext.Provider value={value}>
      {children}
    </ChatRoomContext.Provider>
  );
};

export const useChatRoomStore = (): ChatRoomStore => {
  const store = useContext(ChatRoomContext);
  if (!store) {
    throw new Error("ChatRoom context not found");
  }
  return store;
};
