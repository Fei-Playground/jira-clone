import { Lorebook } from "@domain/lorebook";
import { useTranslation } from "@app/store/locale.store";

export const TabLorebooks = ({
  lorebooks,
  selectedLorebookIds,
  setSelectedLorebookIds,
}: TabLorebooksProps): JSX.Element => {
  const { t } = useTranslation();

  const toggle = (lorebookId: string) => {
    setSelectedLorebookIds(
      selectedLorebookIds.includes(lorebookId)
        ? selectedLorebookIds.filter((id) => id !== lorebookId)
        : [...selectedLorebookIds, lorebookId]
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-font-subtlest">
        {t("companions.card.lorebooksHint")}
      </p>
      {lorebooks.length === 0 ? (
        <p className="text-sm text-font-subtlest">
          {t("companions.card.noLorebooksYet")}
        </p>
      ) : (
        <ul className="space-y-2">
          {lorebooks.map((book: Lorebook) => (
            <li
              key={book.id}
              className="rounded-md p-2 hover:bg-background-neutral"
            >
              <label className="flex items-center gap-2 text-sm text-font">
                <input
                  type="checkbox"
                  checked={selectedLorebookIds.includes(book.id)}
                  onChange={() => toggle(book.id)}
                  aria-label={book.name}
                  className="h-4 w-4"
                />
                <span className="font-primary-bold">{book.name}</span>
              </label>
              {book.description && (
                <p className="ml-6 text-xs text-font-subtlest">
                  {book.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface TabLorebooksProps {
  lorebooks: Lorebook[];
  selectedLorebookIds: string[];
  setSelectedLorebookIds: (ids: string[]) => void;
}
