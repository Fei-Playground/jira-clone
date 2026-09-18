import { useTranslation } from "@app/store/locale.store";

export const TabAppearance = ({
  appearance,
  setAppearance,
  speechStyle,
  setSpeechStyle,
  exampleDialogue,
  setExampleDialogue,
}: TabAppearanceProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-xs text-font-subtlest">
          {t("companions.card.appearanceLabel")}
        </span>
        <textarea
          value={appearance}
          onChange={(e) => setAppearance(e.target.value)}
          placeholder={t("companions.card.appearancePlaceholder")}
          aria-label={t("companions.card.companionAppearance")}
          rows={3}
          className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-font-subtlest">
          {t("companions.card.speechStyleLabel")}
        </span>
        <textarea
          value={speechStyle}
          onChange={(e) => setSpeechStyle(e.target.value)}
          placeholder={t("companions.card.speechStylePlaceholder")}
          aria-label={t("companions.card.companionSpeechStyle")}
          rows={2}
          className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-font-subtlest">
          {t("companions.card.exampleDialogueLabel")}
        </span>
        <p className="mb-1 text-2xs text-font-subtlest">
          {t("companions.card.exampleDialogueHint")}
        </p>
        <textarea
          value={exampleDialogue}
          onChange={(e) => setExampleDialogue(e.target.value)}
          placeholder={t("companions.card.exampleDialoguePlaceholder")}
          aria-label={t("companions.card.companionExampleDialogue")}
          rows={4}
          className="font-mono w-full resize-none rounded-md border-none bg-background-input p-2.5 text-xs outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
        />
      </label>
    </div>
  );
};

interface TabAppearanceProps {
  appearance: string;
  setAppearance: (value: string) => void;
  speechStyle: string;
  setSpeechStyle: (value: string) => void;
  exampleDialogue: string;
  setExampleDialogue: (value: string) => void;
}
