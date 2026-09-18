import { useState } from "react";
import * as Dialog from "@app/components/dialog";
import { Button } from "@app/components/button";
import { AuthorNote } from "@domain/chat-message";
import { useTranslation } from "@app/store/locale.store";

const DEPTH_OPTIONS = [1, 2, 4];

export const AuthorNotePanel = ({
  isOpen,
  authorNote,
  onClose,
  onSave,
  onClear,
}: AuthorNotePanelProps): JSX.Element => {
  const { t } = useTranslation();
  const [text, setText] = useState(authorNote?.text ?? "");
  const [depth, setDepth] = useState(authorNote?.depth ?? 2);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[440px]">
            <Dialog.Title>{t("companions.authorNote.title")}</Dialog.Title>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-font-subtlest">
                  {t("companions.authorNote.textLabel")}
                </span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("companions.authorNote.textPlaceholder")}
                  rows={4}
                  aria-label={t("companions.authorNote.textLabel")}
                  className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
                />
              </label>

              <div>
                <p className="mb-1 text-xs text-font-subtlest">
                  {t("companions.authorNote.depthLabel")}
                </p>
                <p className="mb-2 text-2xs text-font-subtlest">
                  {t("companions.authorNote.depthHint")}
                </p>
                <div className="flex gap-2">
                  {DEPTH_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => setDepth(option)}
                      className={
                        option === depth
                          ? "rounded-md bg-background-brand-bold px-3 py-1.5 text-sm text-font-inverse"
                          : "rounded-md bg-background-neutral px-3 py-1.5 text-sm text-font hover:bg-background-neutral-hovered"
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                color="neutral"
                variant="text"
                onClick={() => {
                  onClear();
                  onClose();
                }}
                aria-label={t("companions.authorNote.clear")}
              >
                {t("companions.authorNote.clear")}
              </Button>
              <Button
                onClick={() => {
                  onSave({ text: text.trim(), depth, updatedAt: Date.now() });
                  onClose();
                }}
                disabled={!text.trim()}
                aria-label={t("companions.authorNote.save")}
              >
                {t("companions.authorNote.save")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface AuthorNotePanelProps {
  isOpen: boolean;
  authorNote: AuthorNote | undefined;
  onClose: () => void;
  onSave: (note: AuthorNote) => void;
  onClear: () => void;
}
