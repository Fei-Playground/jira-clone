import {
  createContext,
  useContext,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { v4 as uuid } from "uuid";
import { Character, CharacterId, charactersMock } from "@domain/character";
import {
  ChatSession,
  ChatSessionId,
  chatSessionsMock,
  createUserMessage,
  createCharacterMessage,
  getScriptedReply,
} from "@domain/chat-message";

export type ResponseStyle = "balanced" | "concise" | "elaborate";

export interface CompanionsSettings {
  responseStyle: ResponseStyle;
  userDisplayName: string;
  immersiveMode: boolean;
}

interface CompanionsStore {
  characters: Character[];
  sessions: ChatSession[];
  selectedCharacterId: CharacterId | null;
  activeSessionId: ChatSessionId | null;
  settings: CompanionsSettings;
  setSettings: Dispatch<SetStateAction<CompanionsSettings>>;
  selectCharacter: (characterId: CharacterId) => void;
  selectSession: (sessionId: ChatSessionId) => void;
  startNewSession: (characterId: CharacterId) => void;
  sendMessage: (text: string) => void;
  addCharacter: (character: Omit<Character, "id" | "createdAt">) => void;
  updateCharacter: (character: Character) => void;
  deleteCharacter: (characterId: CharacterId) => void;
}

const CompanionsContext = createContext<CompanionsStore | undefined>(undefined);

const DEFAULT_SETTINGS: CompanionsSettings = {
  responseStyle: "balanced",
  userDisplayName: "You",
  immersiveMode: true,
};

export const CompanionsContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [characters, setCharacters] = useState<Character[]>(charactersMock);
  const [sessions, setSessions] = useState<ChatSession[]>(chatSessionsMock);
  const [selectedCharacterId, setSelectedCharacterId] =
    useState<CharacterId | null>(charactersMock[0]?.id ?? null);
  const [activeSessionId, setActiveSessionId] = useState<ChatSessionId | null>(
    () =>
      chatSessionsMock.find((s) => s.characterId === charactersMock[0]?.id)
        ?.id ?? null
  );
  const [settings, setSettings] =
    useState<CompanionsSettings>(DEFAULT_SETTINGS);

  const selectCharacter = useCallback(
    (characterId: CharacterId) => {
      setSelectedCharacterId(characterId);
      const existing = sessions
        .filter((s) => s.characterId === characterId)
        .sort((a, b) => b.updatedAt - a.updatedAt)[0];
      setActiveSessionId(existing?.id ?? null);
    },
    [sessions]
  );

  const selectSession = useCallback(
    (sessionId: ChatSessionId) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setSelectedCharacterId(session.characterId);
        setActiveSessionId(sessionId);
      }
    },
    [sessions]
  );

  const startNewSession = useCallback(
    (characterId: CharacterId) => {
      const character = characters.find((c) => c.id === characterId);
      if (!character) return;

      const newSession: ChatSession = {
        id: uuid(),
        characterId,
        title: "New conversation",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [createCharacterMessage(character.greeting)],
      };
      setSessions((prev) => [...prev, newSession]);
      setSelectedCharacterId(characterId);
      setActiveSessionId(newSession.id);
    },
    [characters]
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!activeSessionId || !selectedCharacterId) return;
      const userMessage = createUserMessage(text);

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: [...session.messages, userMessage],
                updatedAt: Date.now(),
                title:
                  session.title === "New conversation"
                    ? text.slice(0, 40)
                    : session.title,
              }
            : session
        )
      );

      // Simulate the character "typing" a scripted reply
      setTimeout(() => {
        setSessions((prev) =>
          prev.map((session) => {
            if (session.id !== activeSessionId) return session;
            const turnIndex = session.messages.filter(
              (m) => m.sender === "user"
            ).length;
            const replyText = getScriptedReply(
              session.characterId,
              turnIndex - 1
            );
            return {
              ...session,
              messages: [
                ...session.messages,
                createCharacterMessage(replyText),
              ],
              updatedAt: Date.now(),
            };
          })
        );
      }, 900);
    },
    [activeSessionId, selectedCharacterId]
  );

  const addCharacter = useCallback(
    (character: Omit<Character, "id" | "createdAt">) => {
      const newCharacter: Character = {
        ...character,
        id: uuid(),
        createdAt: Date.now(),
        isCustom: true,
      };
      setCharacters((prev) => [...prev, newCharacter]);
      const newSession: ChatSession = {
        id: uuid(),
        characterId: newCharacter.id,
        title: "New conversation",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [createCharacterMessage(newCharacter.greeting)],
      };
      setSessions((prev) => [...prev, newSession]);
      setSelectedCharacterId(newCharacter.id);
      setActiveSessionId(newSession.id);
    },
    []
  );

  const updateCharacter = useCallback((updated: Character) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }, []);

  const deleteCharacter = useCallback(
    (characterId: CharacterId) => {
      setCharacters((prev) => prev.filter((c) => c.id !== characterId));
      setSessions((prev) => prev.filter((s) => s.characterId !== characterId));
      if (selectedCharacterId === characterId) {
        const fallback = characters.find((c) => c.id !== characterId);
        setSelectedCharacterId(fallback?.id ?? null);
        setActiveSessionId(
          sessions.find((s) => s.characterId === fallback?.id)?.id ?? null
        );
      }
    },
    [characters, sessions, selectedCharacterId]
  );

  const value: CompanionsStore = {
    characters,
    sessions,
    selectedCharacterId,
    activeSessionId,
    settings,
    setSettings,
    selectCharacter,
    selectSession,
    startNewSession,
    sendMessage,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  };

  return (
    <CompanionsContext.Provider value={value}>
      {children}
    </CompanionsContext.Provider>
  );
};

export const useCompanionsStore = (): CompanionsStore => {
  const store = useContext(CompanionsContext);
  if (!store) {
    throw new Error("Companions context not found");
  }
  return store;
};
