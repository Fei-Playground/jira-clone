import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { Character, CharacterId } from "@domain/character";
import { Lorebook } from "@domain/lorebook";
import { useTranslation } from "@app/store/locale.store";
import { Tooltip } from "@app/components/tooltip";
import { CharacterList } from "./character-list";
import { ChatWindow } from "./chat-window";
import { CharacterEditor } from "./character-editor";
import { ChatHistory } from "./chat-history";
import { CompanionSettings } from "./companion-settings";
import { LorebookEditor } from "./lorebook-editor";
import { CharacterPreview } from "./character-preview";
import {
  CompanionsContextProvider,
  useCompanionsStore,
} from "./companions.store";
import { LorebookContextProvider, useLorebookStore } from "./lorebook.store";
import { ChatRoomContextProvider, useChatRoomStore } from "./chat-room.store";
import { GroupChatCreator, GroupChatWindow, RoomList } from "./group-chat";

export const CompanionsView = (): JSX.Element => {
  return (
    <LorebookContextProvider>
      <CompanionsContextProvider>
        <ChatRoomContextProvider>
          <CompanionsLayout />
        </ChatRoomContextProvider>
      </CompanionsContextProvider>
    </LorebookContextProvider>
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
  const { lorebooks, addEntry, createLorebook } = useLorebookStore();
  const { rooms, activeRoomId, selectRoom, createRoom, deleteRoom } =
    useChatRoomStore();
  const { t } = useTranslation();

  const [mainView, setMainView] = useState<"chat" | "lorebooks" | "rooms">(
    "chat"
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [previewCharacter, setPreviewCharacter] = useState<Character | null>(
    null
  );
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const handleImportCharacter = (
    character: Omit<Character, "id" | "createdAt">,
    lorebooks: Lorebook[]
  ) => {
    addCharacter(character);
    lorebooks.forEach((book) => {
      const created = createLorebook(book.name, book.description);
      book.entries.forEach((entry) => {
        addEntry(created.id, {
          name: entry.name,
          keywords: entry.keywords,
          content: entry.content,
          enabled: entry.enabled,
          priority: entry.priority,
          constant: entry.constant,
        });
      });
    });
  };

  const selectedCharacter = characters.find(
    (c) => c.id === selectedCharacterId
  );
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const characterSessions = sessions.filter(
    (s) => s.characterId === selectedCharacterId
  );
  const activeRoom = rooms.find((r) => r.id === activeRoomId);

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

  const openCharacterPreviewById = (characterId: CharacterId) => {
    const character = characters.find((c) => c.id === characterId);
    if (character) setPreviewCharacter(character);
  };

  const previewModal = previewCharacter && (
    <CharacterPreview
      character={previewCharacter}
      lorebooks={lorebooks}
      onClose={() => setPreviewCharacter(null)}
      onEdit={() => {
        setEditingCharacter(previewCharacter);
        setPreviewCharacter(null);
        setIsEditorOpen(true);
      }}
    />
  );

  if (mainView === "lorebooks") {
    return (
      <div className="flex h-full w-full overflow-hidden bg-elevation-surface">
        <div className="flex w-[64px] min-w-[64px] flex-col items-center border-r border-border bg-elevation-surface-sunken py-4">
          <button
            onClick={() => setMainView("chat")}
            aria-label={t("companions.sidebar.backToChat")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
          >
            {"\u2190"}
          </button>
        </div>
        <LorebookEditor />
      </div>
    );
  }

  if (mainView === "rooms") {
    return (
      <div className="flex h-full w-full overflow-hidden bg-elevation-surface">
        <aside className="flex h-full w-[280px] min-w-[280px] flex-col border-r border-border bg-elevation-surface-sunken">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setMainView("chat")}
              aria-label={t("companions.sidebar.backToChat")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              {"\u2190"}
            </button>
            <h2 className="font-primary-black text-lg text-font">
              {t("companions.group.sidebarNav")}
            </h2>
            <Tooltip title={t("companions.group.createRoom")}>
              <button
                onClick={() => setIsCreatorOpen(true)}
                aria-label={t("companions.group.createRoom")}
                className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-brand-subtlest hover:text-icon-brand"
              >
                <RiAddLine size={20} />
              </button>
            </Tooltip>
          </div>
          <div className="flex-1 overflow-hidden px-2">
            <RoomList
              rooms={rooms}
              activeRoomId={activeRoomId}
              charactersById={characters.reduce<Record<string, Character>>(
                (acc, c) => {
                  acc[c.id] = c;
                  return acc;
                },
                {}
              )}
              onSelectRoom={selectRoom}
            />
          </div>
        </aside>

        {activeRoom ? (
          <GroupChatWindow
            room={activeRoom}
            onDeleteRoom={() => deleteRoom(activeRoom.id)}
            onViewCharacter={openCharacterPreviewById}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-font-subtlest">
            {t("companions.group.noRoomsYet")}
          </div>
        )}

        <GroupChatCreator
          isOpen={isCreatorOpen}
          characters={characters}
          lorebooks={lorebooks}
          onClose={() => setIsCreatorOpen(false)}
          onCreate={createRoom}
        />

        {previewModal}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-elevation-surface">
      <CharacterList
        onCreateCharacter={openCreateCharacter}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLorebooks={() => setMainView("lorebooks")}
        onOpenRooms={() => setMainView("rooms")}
        onImportCharacter={handleImportCharacter}
        onOpenPreview={(character) => setPreviewCharacter(character)}
        onEditCharacter={(character) => {
          setEditingCharacter(character);
          setIsEditorOpen(true);
        }}
      />

      {selectedCharacter ? (
        <ChatWindow
          character={selectedCharacter}
          session={activeSession}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onEditCharacter={openEditCharacter}
          onOpenPreview={() => setPreviewCharacter(selectedCharacter)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-font-subtlest">
          {t("companions.emptyState")}
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

      {previewModal}
    </div>
  );
};
