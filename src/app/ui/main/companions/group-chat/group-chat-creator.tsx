import { useState } from "react";
import cx from "classix";
import * as Dialog from "@app/components/dialog";
import { Button } from "@app/components/button";
import { Character, CharacterId } from "@domain/character";
import { Lorebook, LorebookId } from "@domain/lorebook";
import {
  TurnMode,
  turnModes,
  isValidMemberCount,
  MIN_ROOM_MEMBERS,
  MAX_ROOM_MEMBERS,
} from "@domain/chat-room";
import { useTranslation } from "@app/store/locale.store";

const TURN_MODE_LABEL_KEY: Record<TurnMode, string> = {
  "round-robin": "companions.group.turnModeRoundRobin",
  natural: "companions.group.turnModeNatural",
  manual: "companions.group.turnModeManual",
};
const TURN_MODE_HINT_KEY: Record<TurnMode, string> = {
  "round-robin": "companions.group.turnModeRoundRobinHint",
  natural: "companions.group.turnModeNaturalHint",
  manual: "companions.group.turnModeManualHint",
};

export const GroupChatCreator = ({
  isOpen,
  characters,
  lorebooks,
  onClose,
  onCreate,
}: GroupChatCreatorProps): JSX.Element => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<
    CharacterId[]
  >([]);
  const [turnMode, setTurnMode] = useState<TurnMode>("round-robin");
  const [selectedLorebookIds, setSelectedLorebookIds] = useState<LorebookId[]>(
    []
  );

  const toggleCharacter = (characterId: CharacterId) => {
    setSelectedCharacterIds((prev) =>
      prev.includes(characterId)
        ? prev.filter((id) => id !== characterId)
        : prev.length < MAX_ROOM_MEMBERS
          ? [...prev, characterId]
          : prev
    );
  };

  const toggleLorebook = (lorebookId: LorebookId) => {
    setSelectedLorebookIds((prev) =>
      prev.includes(lorebookId)
        ? prev.filter((id) => id !== lorebookId)
        : [...prev, lorebookId]
    );
  };

  const canCreate = isValidMemberCount(selectedCharacterIds.length);

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate({
      name: name.trim(),
      characterIds: selectedCharacterIds,
      turnMode,
      lorebookIds: selectedLorebookIds,
    });
    setName("");
    setSelectedCharacterIds([]);
    setTurnMode("round-robin");
    setSelectedLorebookIds([]);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[680px]">
            <Dialog.Title>{t("companions.group.createRoom")}</Dialog.Title>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-1 block text-xs text-font-subtlest">
                  {t("companions.group.roomNameLabel")}
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("companions.group.roomNamePlaceholder")}
                  className="w-full rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
                />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-font-subtlest">
                    {t("companions.group.membersLabel")}
                  </span>
                  <span className="text-xs text-font-subtlest">
                    {t("companions.group.memberCount", {
                      count: selectedCharacterIds.length,
                      max: MAX_ROOM_MEMBERS,
                    })}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {characters.map((character) => {
                    const isSelected = selectedCharacterIds.includes(
                      character.id
                    );
                    return (
                      <button
                        key={character.id}
                        onClick={() => toggleCharacter(character.id)}
                        className={cx(
                          "flex items-center gap-2 rounded-md border p-2 text-left",
                          isSelected
                            ? "border-border-brand bg-background-brand-subtlest"
                            : "border-border hover:bg-background-neutral"
                        )}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
                          style={{
                            background: `linear-gradient(145deg, ${character.avatarColor}, ${character.avatarColor}cc)`,
                          }}
                        >
                          {character.avatarEmoji}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-font">
                            {character.name}
                          </span>
                          <span className="block truncate text-2xs text-font-subtlest">
                            {character.tagline}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {!canCreate && selectedCharacterIds.length > 0 && (
                  <p className="mt-1 text-xs text-font-danger">
                    {t("companions.group.memberCountLimit", {
                      min: MIN_ROOM_MEMBERS,
                      max: MAX_ROOM_MEMBERS,
                    })}
                  </p>
                )}
                {selectedCharacterIds.length === 0 && (
                  <p className="mt-1 text-xs text-font-subtlest">
                    {t("companions.group.needAtLeastTwo", {
                      min: MIN_ROOM_MEMBERS,
                    })}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs text-font-subtlest">
                  {t("companions.group.turnModeLabel")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {turnModes.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTurnMode(mode)}
                      className={cx(
                        "rounded-md border p-2 text-left text-xs",
                        mode === turnMode
                          ? "border-border-brand bg-background-brand-subtlest"
                          : "border-border hover:bg-background-neutral"
                      )}
                    >
                      <span className="block font-bold text-font">
                        {t(TURN_MODE_LABEL_KEY[mode] as never)}
                      </span>
                      <span className="block text-font-subtlest">
                        {t(TURN_MODE_HINT_KEY[mode] as never)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {lorebooks.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-font-subtlest">
                    {t("companions.group.lorebooksLabel")}
                  </p>
                  <ul className="space-y-1">
                    {lorebooks.map((book) => (
                      <li key={book.id}>
                        <label className="flex items-center gap-2 rounded-md p-1.5 text-sm text-font hover:bg-background-neutral">
                          <input
                            type="checkbox"
                            checked={selectedLorebookIds.includes(book.id)}
                            onChange={() => toggleLorebook(book.id)}
                            className="h-4 w-4"
                          />
                          {book.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                color="neutral"
                variant="subtlest"
                onClick={onClose}
                aria-label={t("companions.group.cancel")}
              >
                {t("companions.group.cancel")}
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!canCreate}
                aria-label={t("companions.group.create")}
              >
                {t("companions.group.create")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface GroupChatCreatorProps {
  isOpen: boolean;
  characters: Character[];
  lorebooks: Lorebook[];
  onClose: () => void;
  onCreate: (args: {
    name: string;
    characterIds: CharacterId[];
    turnMode: TurnMode;
    lorebookIds: LorebookId[];
  }) => void;
}
