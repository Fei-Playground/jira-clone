import { LorebookEntry } from "@domain/lorebook";
import { TagInput } from "@app/components/tag-input";
import { useTranslation } from "@app/store/locale.store";

export const LorebookEntryForm = ({
  entry,
  onChange,
  onDelete,
}: LorebookEntryFormProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-xs text-font-subtlest">
          {t("companions.lorebook.entryNameLabel")}
        </span>
        <input
          value={entry.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={t("companions.lorebook.entryNamePlaceholder")}
          className="w-full rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-font-subtlest">
          {t("companions.lorebook.keywordsLabel")}
        </span>
        <TagInput
          tags={entry.keywords}
          onChange={(keywords) => onChange({ keywords })}
          placeholder={t("companions.lorebook.keywordsPlaceholder")}
          ariaLabel={t("companions.lorebook.keywordsLabel")}
          removeTagAriaLabel={(keyword) =>
            t("companions.lorebook.removeKeyword", { keyword })
          }
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-font-subtlest">
          {t("companions.lorebook.contentLabel")}
        </span>
        <textarea
          value={entry.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder={t("companions.lorebook.contentPlaceholder")}
          rows={4}
          className="w-full resize-none rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
        />
      </label>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-font">
          <input
            type="checkbox"
            checked={entry.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="h-4 w-4"
          />
          {t("companions.lorebook.enabledLabel")}
        </label>

        <label className="flex items-center gap-2 text-sm text-font">
          <input
            type="checkbox"
            checked={entry.constant}
            onChange={(e) => onChange({ constant: e.target.checked })}
            className="h-4 w-4"
          />
          {t("companions.lorebook.constantLabel")}
        </label>

        <label className="flex items-center gap-2 text-sm text-font">
          {t("companions.lorebook.priorityLabel")}
          <input
            type="number"
            value={entry.priority}
            onChange={(e) =>
              onChange({ priority: Number(e.target.value) || 0 })
            }
            className="w-16 rounded-md border-none bg-background-input p-1.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
          />
        </label>
      </div>

      {entry.constant && (
        <p className="text-xs text-font-subtlest">
          {t("companions.lorebook.constantHint")}
        </p>
      )}

      <button
        onClick={onDelete}
        aria-label={t("companions.lorebook.deleteEntry")}
        className="text-sm text-font-danger hover:underline"
      >
        {t("companions.lorebook.deleteEntry")}
      </button>
    </div>
  );
};

interface LorebookEntryFormProps {
  entry: LorebookEntry;
  onChange: (patch: Partial<Omit<LorebookEntry, "id">>) => void;
  onDelete: () => void;
}
