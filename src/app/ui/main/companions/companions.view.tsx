import { useState } from "react";
import { Character } from "@domain/character";
import { CharacterList } from "./character-list";
import { ChatWindow } from "./chat-window";
import { CharacterEditor } from "./character-editor";
import { ChatHistory } from "./chat-history";
import { CompanionSettings } from "./companion-settings";
import {
  CompanionsContextProvider,
  useCompanionsStore,
} from "./companions.store";

export const CompanionsView = (): JSX.Element => {
  return (
    <CompanionsContextProvider>
      <CompanionsLayout />
    </CompanionsContextProvider>
  );
};

const CompanionsLayout = (): JSX.Element => {
  const {
    characters,
    sessions,
    selectedCharacterId,
    activeSessionId,
    selectSession,
    startNewSession,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  } = useCompanionsStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const selectedCharacter = characters.find(
    (c) => c.id === selectedCharacterId
  );
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const characterSessions = sessions.filter(
    (s) => s.characterId === selectedCharacterId
  );

  const openCreateCharacter = () => {
    setEditingCharacter(null);
    setIsEditorOpen(true);
  };

  const openEditCharacter = () => {
    if (selectedCharacter) {
      setEditingCharacter(selectedCharacter);
      setIsEditorOpen(true);
    }
  };

  const handleSaveCharacter = (
    character: Partial<Character> & { name: string }
  ) => {
    if (character.id) {
      updateCharacter(character as Character);
    } else {
      addCharacter({
        name: character.name,
        tagline: character.tagline ?? "",
        personality: character.personality ?? "",
        scenario: character.scenario ?? "",
        greeting: character.greeting ?? "",
        avatarColor: character.avatarColor ?? "#3b2f7a",
        avatarEmoji: character.avatarEmoji ?? "\u{1F916}",
        tags: character.tags ?? [],
      });
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-elevation-surface">
      <CharacterList
        onCreateCharacter={openCreateCharacter}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {selectedCharacter ? (
        <ChatWindow
          character={selectedCharacter}
          session={activeSession}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onEditCharacter={openEditCharacter}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-font-subtlest">
          Create a companion to start chatting.
        </div>
      )}

      <CharacterEditor
        key={editingCharacter?.id ?? "new"}
        isOpen={isEditorOpen}
        character={editingCharacter}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveCharacter}
        onDelete={deleteCharacter}
      />

      {selectedCharacter && (
        <ChatHistory
          isOpen={isHistoryOpen}
          character={selectedCharacter}
          sessions={characterSessions}
          activeSessionId={activeSessionId}
          onClose={() => setIsHistoryOpen(false)}
          onSelectSession={selectSession}
          onNewSession={() => startNewSession(selectedCharacter.id)}
        />
      )}

      <CompanionSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
