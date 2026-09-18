import cx from "classix";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  RiAddLine,
  RiBook2Line,
  RiGroupLine,
  RiSettings3Line,
  RiMore2Fill,
} from "react-icons/ri";
import { Character } from "@domain/character";
import { ScrollArea } from "@app/components/scroll-area";
import { Tooltip } from "@app/components/tooltip";
import { useTranslation } from "@app/store/locale.store";
import { useCompanionsStore } from "../companions.store";
import { CharacterCardImportZone } from "../character-card-io";

export const CharacterList = ({
  onCreateCharacter,
  onOpenSettings,
  onOpenLorebooks,
  onOpenRooms,
  onImportCharacter,
  onOpenPreview,
  onEditCharacter,
}: CharacterListProps): JSX.Element => {
  const { characters, selectedCharacterId, selectCharacter } =
    useCompanionsStore();
  const { t } = useTranslation();

  return (
    <aside className="flex h-full w-[280px] min-w-[280px] flex-col border-r border-border bg-elevation-surface-sunken">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="font-primary-black text-lg text-font">
          {t("companions.sidebar.title")}
        </h2>
        <Tooltip title={t("companions.sidebar.createNew")}>
          <button
            onClick={onCreateCharacter}
            aria-label={t("companions.sidebar.createNew")}
            className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-brand-subtlest hover:text-icon-brand"
          >
            <RiAddLine size={20} />
          </button>
        </Tooltip>
      </div>

      <div className="space-y-1 px-2">
        <button
          onClick={onOpenLorebooks}
          aria-label={t("companions.sidebar.openLorebooks")}
          className="flex w-full items-center gap-3 rounded p-2 text-sm text-font hover:bg-background-neutral"
        >
          <RiBook2Line size={18} />
          <span>{t("companions.sidebar.lorebooksNav")}</span>
        </button>
        <button
          onClick={onOpenRooms}
          aria-label={t("companions.group.openRooms")}
          className="flex w-full items-center gap-3 rounded p-2 text-sm text-font hover:bg-background-neutral"
        >
          <RiGroupLine size={18} />
          <span>{t("companions.group.sidebarNav")}</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden px-2">
        <ScrollArea>
          <ul className="space-y-1 pb-4">
            {characters.map((character) => (
              <li key={character.id}>
                <CharacterListItem
                  character={character}
                  isSelected={character.id === selectedCharacterId}
                  onSelect={() => selectCharacter(character.id)}
                  onOpenPreview={() => onOpenPreview(character)}
                  onEditCharacter={() => onEditCharacter(character)}
                  chatWithLabel={t("companions.sidebar.chatWith", {
                    name: character.name,
                  })}
                  customLabel={t("companions.sidebar.custom")}
                  moreLabel={t("companions.editor.moreActions")}
                  viewCardLabel={t("companions.preview.openPreview", {
                    name: character.name,
                  })}
                  editLabel={t("companions.chatWindow.editCompanion")}
                />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>

      <div className="border-t border-border p-2">
        <CharacterCardImportZone
          existingNames={characters.map((c) => c.name)}
          onImport={onImportCharacter}
        />
      </div>

      <div className="border-t border-border p-2">
        <button
          onClick={onOpenSettings}
          aria-label={t("companions.sidebar.settings")}
          className="flex w-full items-center gap-3 rounded p-2 text-sm text-font-subtlest hover:bg-background-neutral"
        >
          <RiSettings3Line size={20} />
          <span>{t("companions.sidebar.settings")}</span>
        </button>
      </div>
    </aside>
  );
};

const CharacterListItem = ({
  character,
  isSelected,
  onSelect,
  onOpenPreview,
  onEditCharacter,
  chatWithLabel,
  customLabel,
  moreLabel,
  viewCardLabel,
  editLabel,
}: {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
  onOpenPreview: () => void;
  onEditCharacter: () => void;
  chatWithLabel: string;
  customLabel: string;
  moreLabel: string;
  viewCardLabel: string;
  editLabel: string;
}): JSX.Element => (
  <div
    className={cx(
      "group flex w-full items-center gap-1 rounded pr-1",
      isSelected ? "bg-background-selected" : "hover:bg-background-neutral"
    )}
  >
    <button
      onClick={onSelect}
      aria-label={chatWithLabel}
      className={cx(
        "flex min-w-0 flex-1 items-center gap-3 p-2 text-left",
        isSelected ? "text-font-brand" : "text-font"
      )}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg shadow-sm ring-2 ring-white/20"
        style={{
          background: `linear-gradient(145deg, ${character.avatarColor}, ${character.avatarColor}cc)`,
        }}
      >
        {character.avatarEmoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-primary-bold text-sm">
            {character.name}
          </span>
          {character.isCustom && (
            <span className="shrink-0 rounded bg-background-neutral px-1.5 py-0.5 text-2xs uppercase text-font-subtlest">
              {customLabel}
            </span>
          )}
        </span>
        <span className="line-clamp-1 text-xs text-font-subtlest">
          {character.tagline}
        </span>
      </span>
    </button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={moreLabel}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-icon hover:bg-background-neutral-hovered"
      >
        <RiMore2Fill size={16} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-[160px] rounded bg-elevation-surface-overlay py-1 shadow-md radix-side-bottom:animate-slide-down"
        >
          <DropdownMenu.Item
            onSelect={onOpenPreview}
            className="cursor-pointer select-none p-2 text-sm text-font outline-none hover:bg-background-neutral"
          >
            {viewCardLabel}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={onEditCharacter}
            className="cursor-pointer select-none p-2 text-sm text-font outline-none hover:bg-background-neutral"
          >
            {editLabel}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
);

interface CharacterListProps {
  onCreateCharacter: () => void;
  onOpenSettings: () => void;
  onOpenLorebooks: () => void;
  onOpenRooms: () => void;
  onImportCharacter: (
    character: Omit<Character, "id" | "createdAt">,
    lorebooks: import("@domain/lorebook").Lorebook[]
  ) => void;
  onOpenPreview: (character: Character) => void;
  onEditCharacter: (character: Character) => void;
}
