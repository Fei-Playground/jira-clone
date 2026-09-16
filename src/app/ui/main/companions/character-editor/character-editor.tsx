import { useState } from "react";
import * as Dialog from "@app/components/dialog";
import * as AlertDialog from "@app/components/alert-dialog";
import { Button } from "@app/components/button";
import { Character } from "@domain/character";
import { useTranslation } from "@app/store/locale.store";
import { TranslationKey } from "@app/locales";

const EMOJI_OPTIONS = [
  "🛰️",
  "🕵️",
  "🌿",
  "🏋️",
  "🐉",
  "🎨",
  "🧙",
  "🤖",
  "👑",
  "🦊",
];
const COLOR_OPTIONS = [
  "#3b2f7a",
  "#4a3728",
  "#1f4d3a",
  "#7a2f1f",
  "#2f4a7a",
  "#7a1f5c",
];

export const CharacterEditor = ({
  isOpen,
  character,
  onClose,
  onSave,
  onDelete,
}: CharacterEditorProps): JSX.Element => {
  const { t } = useTranslation();
  const [name, setName] = useState(character?.name ?? "");
  const [tagline, setTagline] = useState(character?.tagline ?? "");
  const [personality, setPersonality] = useState(character?.personality ?? "");
  const [scenario, setScenario] = useState(character?.scenario ?? "");
  const [greeting, setGreeting] = useState(character?.greeting ?? "");
  const [avatarEmoji, setAvatarEmoji] = useState(
    character?.avatarEmoji ?? EMOJI_OPTIONS[0]
  );
  const [avatarColor, setAvatarColor] = useState(
    character?.avatarColor ?? COLOR_OPTIONS[0]
  );

  const isEditing = Boolean(character);
  const isValid = name.trim().length > 0 && greeting.trim().length > 0;

  const resetAndClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (!isValid) return;

    onSave({
      ...(character ?? {}),
      name: name.trim(),
      tagline: tagline.trim(),
      personality: personality.trim(),
      scenario: scenario.trim(),
      greeting: greeting.trim(),
      avatarEmoji,
      avatarColor,
      tags: character?.tags ?? [],
    });
    resetAndClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && resetAndClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[640px]">
            <Dialog.Title>
              {isEditing
                ? t("companions.editor.editTitle")
                : t("companions.editor.createTitle")}
            </Dialog.Title>

            <div className="grid grid-cols-[96px_1fr] gap-6">
              <div>
                <p className="mb-2 text-xs text-font-subtlest">
                  {t("companions.editor.avatarLabel")}
                </p>
                <span
                  className="mb-3 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                  style={{ backgroundColor: avatarColor }}
                >
                  {avatarEmoji}
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setAvatarEmoji(emoji)}
                      aria-label={t("companions.editor.chooseAvatar", {
                        emoji,
                      })}
                      className="flex h-7 w-7 items-center justify-center rounded hover:bg-background-neutral"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAvatarColor(color)}
                      aria-label={t("companions.editor.chooseColor", { color })}
                      style={{ backgroundColor: color }}
                      className="h-5 w-5 rounded-full outline outline-2 outline-offset-1 outline-transparent hover:outline-border-brand"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Field label={t("companions.editor.nameLabel")}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("companions.editor.namePlaceholder")}
                    aria-label={t("companions.editor.companionName")}
                    className="w-full rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
                  />
                </Field>
                <Field label={t("companions.editor.taglineLabel")}>
                  <input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder={t("companions.editor.taglinePlaceholder")}
                    aria-label={t("companions.editor.companionTagline")}
                    className="w-full rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <Field label={t("companions.editor.personalityLabel")}>
                <textarea
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  placeholder={t("companions.editor.personalityPlaceholder")}
                  aria-label={t("companions.editor.companionPersonality")}
                  rows={2}
                  className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
                />
              </Field>
              <Field label={t("companions.editor.scenarioLabel")}>
                <textarea
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder={t("companions.editor.scenarioPlaceholder")}
                  aria-label={t("companions.editor.companionScenario")}
                  rows={2}
                  className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
                />
              </Field>
              <Field label={t("companions.editor.greetingLabel")}>
                <textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder={t("companions.editor.greetingPlaceholder")}
                  aria-label={t("companions.editor.companionGreeting")}
                  rows={2}
                  className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
                />
              </Field>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                {isEditing && character && !isDefaultCharacter(character) && (
                  <DeleteCharacterAction
                    characterName={character.name}
                    onConfirm={() => {
                      onDelete(character.id);
                      resetAndClose();
                    }}
                    t={t}
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  color="neutral"
                  variant="subtlest"
                  onClick={resetAndClose}
                  aria-label={t("companions.editor.cancel")}
                >
                  {t("companions.editor.cancel")}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!isValid}
                  aria-label={t("companions.editor.saveCompanion")}
                >
                  {isEditing
                    ? t("companions.editor.saveChanges")
                    : t("companions.editor.createCompanion")}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const isDefaultCharacter = (character: Character): boolean =>
  !character.isCustom;

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): JSX.Element => (
  <label className="block">
    <span className="mb-1 block text-xs text-font-subtlest">{label}</span>
    {children}
  </label>
);

const DeleteCharacterAction = ({
  characterName,
  onConfirm,
  t,
}: {
  characterName: string;
  onConfirm: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}): JSX.Element => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <Button
        color="danger"
        variant="text"
        aria-label={t("companions.editor.deleteCompanion")}
      >
        {t("companions.editor.deleteCompanion")}
      </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay />
      <AlertDialog.Content>
        <AlertDialog.Title>
          {t("companions.editor.deleteTitle", { name: characterName })}
        </AlertDialog.Title>
        <p className="text-sm text-font-subtlest">
          {t("companions.editor.deleteDescription")}
        </p>
        <AlertDialog.Description>
          <AlertDialog.Cancel aria-label={t("companions.editor.cancelDelete")}>
            {t("companions.editor.cancel")}
          </AlertDialog.Cancel>
          <AlertDialog.Action
            onClick={onConfirm}
            aria-label={t("companions.editor.confirmDelete")}
          >
            {t("common.delete")}
          </AlertDialog.Action>
        </AlertDialog.Description>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

interface CharacterEditorProps {
  isOpen: boolean;
  character: Character | null;
  onClose: () => void;
  onSave: (character: Partial<Character> & { name: string }) => void;
  onDelete: (characterId: string) => void;
}
