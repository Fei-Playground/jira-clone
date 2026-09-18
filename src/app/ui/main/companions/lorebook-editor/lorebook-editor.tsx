import { useState } from "react";
import { RiAddLine, RiBook2Line } from "react-icons/ri";
import cx from "classix";
import { ScrollArea } from "@app/components/scroll-area";
import { Button } from "@app/components/button";
import { useTranslation } from "@app/store/locale.store";
import { useLorebookStore } from "../lorebook.store";
import { LorebookEntryForm } from "./lorebook-entry-form";

export const LorebookEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    lorebooks,
    createLorebook,
    updateLorebook,
    deleteLorebook,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useLorebookStore();

  const [selectedLorebookId, setSelectedLorebookId] = useState<string | null>(
    lorebooks[0]?.id ?? null
  );
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    lorebooks[0]?.entries[0]?.id ?? null
  );

  const selectedLorebook =
    lorebooks.find((book) => book.id === selectedLorebookId) ?? lorebooks[0];
  const selectedEntry = selectedLorebook?.entries.find(
    (entry) => entry.id === selectedEntryId
  );

  const handleCreateLorebook = () => {
    const newBook = createLorebook(t("companions.lorebook.untitledName"), "");
    setSelectedLorebookId(newBook.id);
    setSelectedEntryId(null);
  };

  const handleAddEntry = () => {
    if (!selectedLorebook) return;
    addEntry(selectedLorebook.id, {
      name: t("companions.lorebook.entryNameLabel"),
      keywords: [],
      content: "",
      enabled: true,
      priority: 1,
      constant: false,
    });
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-elevation-surface">
      <aside className="flex h-full w-[280px] min-w-[280px] flex-col border-r border-border bg-elevation-surface-sunken">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="font-primary-black text-lg text-font">
            {t("companions.lorebook.sidebarTitle")}
          </h2>
          <button
            onClick={handleCreateLorebook}
            aria-label={t("companions.lorebook.createNew")}
            className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-brand-subtlest hover:text-icon-brand"
          >
            <RiAddLine size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden px-2">
          <ScrollArea>
            <ul className="space-y-1 pb-4">
              {lorebooks.map((book) => (
                <li key={book.id}>
                  <button
                    onClick={() => {
                      setSelectedLorebookId(book.id);
                      setSelectedEntryId(book.entries[0]?.id ?? null);
                    }}
                    className={cx(
                      "flex w-full items-center gap-2 rounded p-2 text-left text-sm",
                      book.id === selectedLorebook?.id
                        ? "bg-background-selected text-font-brand"
                        : "text-font hover:bg-background-neutral"
                    )}
                  >
                    <RiBook2Line size={16} className="shrink-0" />
                    <span className="truncate">{book.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </aside>

      {selectedLorebook ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-[260px] min-w-[260px] flex-col border-r border-border">
            <div className="space-y-3 border-b border-border p-4">
              <input
                value={selectedLorebook.name}
                onChange={(e) =>
                  updateLorebook(selectedLorebook.id, { name: e.target.value })
                }
                placeholder={t("companions.lorebook.namePlaceholder")}
                className="w-full rounded-md border-none bg-background-input p-2 font-primary-bold text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
              />
              <textarea
                value={selectedLorebook.description}
                onChange={(e) =>
                  updateLorebook(selectedLorebook.id, {
                    description: e.target.value,
                  })
                }
                placeholder={t("companions.lorebook.descriptionPlaceholder")}
                rows={4}
                className="w-full resize-none rounded-md border-none bg-background-input p-2 text-xs outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
              />
              <Button
                variant="subtlest"
                color="danger"
                className="w-full justify-center text-xs"
                onClick={() => {
                  deleteLorebook(selectedLorebook.id);
                  setSelectedLorebookId(null);
                  setSelectedEntryId(null);
                }}
                aria-label={t("companions.lorebook.deleteLorebook")}
              >
                {t("companions.lorebook.deleteLorebook")}
              </Button>
            </div>

            <div className="flex items-center justify-between px-4 py-2">
              <p className="font-primary-bold text-xs text-font-subtlest">
                {t("companions.lorebook.entriesTitle")}
              </p>
              <button
                onClick={handleAddEntry}
                aria-label={t("companions.lorebook.addEntry")}
                className="flex h-7 w-7 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
              >
                <RiAddLine size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden px-2">
              <ScrollArea>
                <ul className="space-y-1 pb-4">
                  {selectedLorebook.entries.map((entry) => (
                    <li key={entry.id}>
                      <button
                        onClick={() => setSelectedEntryId(entry.id)}
                        className={cx(
                          "w-full rounded p-2 text-left text-sm",
                          entry.id === selectedEntryId
                            ? "bg-background-selected text-font-brand"
                            : "text-font hover:bg-background-neutral"
                        )}
                      >
                        <span className="flex items-center gap-2 truncate">
                          {!entry.enabled && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-font-subtlest" />
                          )}
                          {entry.name}
                        </span>
                      </button>
                    </li>
                  ))}
                  {selectedLorebook.entries.length === 0 && (
                    <li className="p-2 text-xs text-font-subtlest">
                      {t("companions.lorebook.noEntriesYet")}
                    </li>
                  )}
                </ul>
              </ScrollArea>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea>
              <div className="p-6">
                {selectedEntry ? (
                  <LorebookEntryForm
                    entry={selectedEntry}
                    onChange={(patch) =>
                      updateEntry(selectedLorebook.id, selectedEntry.id, patch)
                    }
                    onDelete={() => {
                      deleteEntry(selectedLorebook.id, selectedEntry.id);
                      setSelectedEntryId(null);
                    }}
                  />
                ) : (
                  <p className="text-sm text-font-subtlest">
                    {t("companions.lorebook.noEntriesYet")}
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-font-subtlest">
          {t("companions.lorebook.noEntriesYet")}
        </div>
      )}
    </div>
  );
};
