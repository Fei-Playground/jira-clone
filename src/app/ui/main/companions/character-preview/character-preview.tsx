import { useState } from "react";
import * as Dialog from "@app/components/dialog";
import { Button } from "@app/components/button";
import { ScrollArea } from "@app/components/scroll-area";
import { Character } from "@domain/character";
import { Lorebook } from "@domain/lorebook";
import { useTranslation } from "@app/store/locale.store";
import { formatDateTime } from "@utils/formatDateTime";
import { ExportCharacterCardButton } from "../character-card-io";
import { ExampleDialogueView } from "./example-dialogue-view";

export const CharacterPreview = ({
  character,
  lorebooks,
  onClose,
  onEdit,
}: CharacterPreviewProps): JSX.Element => {
  const { t, locale } = useTranslation();
  const images = character.images ?? [];
  const [activeImageId, setActiveImageId] = useState<string | undefined>(
    images.find((img) => img.isPrimary)?.id ?? images[0]?.id
  );
  const activeImage =
    images.find((img) => img.id === activeImageId) ?? images[0];

  const boundLorebooks = lorebooks.filter((book) =>
    (character.lorebookIds ?? []).includes(book.id)
  );

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="flex max-h-[85vh] max-w-[720px] flex-col">
            <Dialog.Title className="sr-only">
              {t("companions.preview.openPreview", { name: character.name })}
            </Dialog.Title>
            <div className="min-h-0 flex-1">
              <ScrollArea>
                <div className="pr-2">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl shadow-sm"
                        style={{
                          background: `linear-gradient(145deg, ${character.avatarColor}, ${character.avatarColor}cc)`,
                        }}
                      >
                        {character.avatarEmoji}
                      </span>
                      <div>
                        <p className="font-primary-black text-2xl text-font">
                          {character.name}
                        </p>
                        <p className="text-sm text-font-subtlest">
                          {character.tagline}
                        </p>
                        {character.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {character.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-background-neutral px-1.5 py-0.5 text-2xs text-font-subtlest"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="shrink-0 text-2xs text-font-subtlest">
                      {t("companions.preview.createdAt", {
                        date: formatDateTime(character.createdAt, locale),
                      })}
                    </p>
                  </div>

                  {images.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={activeImage?.url}
                        alt={activeImage?.caption ?? character.name}
                        className="h-56 w-full rounded-md object-cover"
                      />
                      {images.length > 1 && (
                        <div className="mt-2 flex gap-2">
                          {images.map((img) => (
                            <button
                              key={img.id}
                              onClick={() => setActiveImageId(img.id)}
                              className={
                                img.id === activeImageId
                                  ? "h-12 w-12 rounded outline outline-2 outline-border-brand"
                                  : "h-12 w-12 rounded opacity-60 hover:opacity-100"
                              }
                            >
                              <img
                                src={img.url}
                                alt=""
                                className="h-full w-full rounded object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Section
                      label={t("companions.preview.appearance")}
                      value={character.appearance}
                    />
                    <Section
                      label={t("companions.preview.speechStyle")}
                      value={character.speechStyle}
                    />
                    <Section
                      label={t("companions.preview.personality")}
                      value={character.personality}
                    />
                    <Section
                      label={t("companions.preview.scenario")}
                      value={character.scenario}
                    />
                    <Section
                      label={t("companions.preview.initialRelationship")}
                      value={character.initialRelationship}
                    />

                    {character.greeting && (
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("companions.preview.greeting")}
                        </p>
                        <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-border bg-elevation-surface-raised px-3 py-2 text-sm text-font">
                          {character.greeting}
                        </div>
                      </div>
                    )}

                    {character.exampleDialogue && (
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("companions.preview.exampleDialogue")}
                        </p>
                        <ExampleDialogueView
                          text={character.exampleDialogue}
                          character={character}
                        />
                      </div>
                    )}

                    <div>
                      <p className="mb-1 text-xs font-bold text-font-subtlest">
                        {t("companions.preview.boundLorebooks")}
                      </p>
                      {boundLorebooks.length === 0 ? (
                        <p className="text-sm text-font-subtlest">
                          {t("companions.preview.noBoundLorebooks")}
                        </p>
                      ) : (
                        <ul className="space-y-1">
                          {boundLorebooks.map((book) => (
                            <li key={book.id} className="text-sm text-font">
                              <span className="font-primary-bold">
                                {book.name}
                              </span>{" "}
                              <span className="text-xs text-font-subtlest">
                                (
                                {t("companions.preview.lorebookEntryCount", {
                                  count: book.entries.length,
                                })}
                                )
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {character.creatorNotes && (
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("companions.preview.creatorNotes")}
                        </p>
                        <p className="mb-1 text-2xs text-font-subtlest">
                          {t("companions.preview.creatorNotesHint")}
                        </p>
                        <p className="whitespace-pre-wrap text-sm text-font">
                          {character.creatorNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>

            <div className="mt-6 flex shrink-0 items-center justify-between">
              <ExportCharacterCardButton
                character={character}
                lorebooks={boundLorebooks}
              />
              <div className="flex gap-2">
                <Button
                  color="neutral"
                  variant="subtlest"
                  onClick={onClose}
                  aria-label={t("companions.preview.close")}
                >
                  {t("companions.preview.close")}
                </Button>
                <Button
                  onClick={onEdit}
                  aria-label={t("companions.preview.editThisCharacter")}
                >
                  {t("companions.preview.editThisCharacter")}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Section = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}): JSX.Element | null => {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-bold text-font-subtlest">{label}</p>
      <p className="whitespace-pre-wrap text-sm text-font">{value}</p>
    </div>
  );
};

interface CharacterPreviewProps {
  character: Character;
  lorebooks: Lorebook[];
  onClose: () => void;
  onEdit: () => void;
}
