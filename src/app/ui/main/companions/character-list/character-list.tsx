import cx from "classix";
import { RiAddLine, RiSettings3Line } from "react-icons/ri";
import { Character } from "@domain/character";
import { ScrollArea } from "@app/components/scroll-area";
import { Tooltip } from "@app/components/tooltip";
import { useCompanionsStore } from "../companions.store";

export const CharacterList = ({
  onCreateCharacter,
  onOpenSettings,
}: CharacterListProps): JSX.Element => {
  const { characters, selectedCharacterId, selectCharacter } =
    useCompanionsStore();

  return (
    <aside className="flex h-full w-[280px] min-w-[280px] flex-col border-r border-border bg-elevation-surface-sunken">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="font-primary-black text-lg text-font">Companions</h2>
        <Tooltip title="Create a new companion">
          <button
            onClick={onCreateCharacter}
            aria-label="Create new companion"
            className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-brand-subtlest hover:text-icon-brand"
          >
            <RiAddLine size={20} />
          </button>
        </Tooltip>
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
                />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <div className="border-t border-border p-2">
        <button
          onClick={onOpenSettings}
          aria-label="Open companion settings"
          className="flex w-full items-center gap-3 rounded p-2 text-sm text-font-subtlest hover:bg-background-neutral"
        >
          <RiSettings3Line size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

const CharacterListItem = ({
  character,
  isSelected,
  onSelect,
}: {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
}): JSX.Element => (
  <button
    onClick={onSelect}
    aria-label={`Chat with ${character.name}`}
    className={cx(
      "flex w-full items-center gap-3 rounded p-2 text-left",
      isSelected
        ? "bg-background-selected text-font-brand"
        : "text-font hover:bg-background-neutral"
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
            Custom
          </span>
        )}
      </span>
      <span className="line-clamp-1 text-xs text-font-subtlest">
        {character.tagline}
      </span>
    </span>
  </button>
);

interface CharacterListProps {
  onCreateCharacter: () => void;
  onOpenSettings: () => void;
}
