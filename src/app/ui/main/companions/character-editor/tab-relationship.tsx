import { useTranslation } from "@app/store/locale.store";

export const TabRelationship = ({
  initialRelationship,
  setInitialRelationship,
  defaultAuthorNote,
  setDefaultAuthorNote,
}: TabRelationshipProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-xs text-font-subtlest">
          {t("companions.card.initialRelationshipLabel")}
        </span>
        <textarea
          value={initialRelationship}
          onChange={(e) => setInitialRelationship(e.target.value)}
          placeholder={t("companions.card.initialRelationshipPlaceholder")}
          aria-label={t("companions.card.companionInitialRelationship")}
          rows={3}
          className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-font-subtlest">
          {t("companions.authorNote.title")}
        </span>
        <p className="mb-1 text-2xs text-font-subtlest">
          {t("companions.authorNote.depthHint")}
        </p>
        <textarea
          value={defaultAuthorNote}
          onChange={(e) => setDefaultAuthorNote(e.target.value)}
          placeholder={t("companions.authorNote.textPlaceholder")}
          aria-label={t("companions.authorNote.title")}
          rows={3}
          className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
        />
      </label>
    </div>
  );
};

interface TabRelationshipProps {
  initialRelationship: string;
  setInitialRelationship: (value: string) => void;
  defaultAuthorNote: string;
  setDefaultAuthorNote: (value: string) => void;
}
