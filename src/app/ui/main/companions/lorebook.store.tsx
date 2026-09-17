import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { v4 as uuid } from "uuid";
import {
  Lorebook,
  LorebookId,
  LorebookEntry,
  LorebookEntryId,
  lorebooksMock,
  getLorebookText,
  matchLorebookEntries,
  MatchedEntry,
} from "@domain/lorebook";
import { useTranslation } from "@app/store/locale.store";

interface LorebookStore {
  lorebooks: Lorebook[];
  createLorebook: (name: string, description: string) => Lorebook;
  updateLorebook: (
    lorebookId: LorebookId,
    patch: Partial<Pick<Lorebook, "name" | "description">>
  ) => void;
  deleteLorebook: (lorebookId: LorebookId) => void;
  addEntry: (lorebookId: LorebookId, entry: Omit<LorebookEntry, "id">) => void;
  updateEntry: (
    lorebookId: LorebookId,
    entryId: LorebookEntryId,
    patch: Partial<Omit<LorebookEntry, "id">>
  ) => void;
  deleteEntry: (lorebookId: LorebookId, entryId: LorebookEntryId) => void;
  matchEntriesForText: (args: {
    lorebookIds: LorebookId[];
    text: string;
    recentMessages: string[];
  }) => MatchedEntry[];
}

const LorebookContext = createContext<LorebookStore | undefined>(undefined);

export const LorebookContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { locale } = useTranslation();
  const [lorebooks, setLorebooks] = useState<Lorebook[]>(lorebooksMock);

  // Re-localize the two seeded example lorebooks (name/description/entry
  // name+content) whenever the language changes — the same pattern used for
  // characters and sessions. User-created lorebooks are left untouched.
  const localizedLorebooks = useMemo(
    () =>
      lorebooks.map((book) => {
        const localizedText = getLorebookText(book.id, locale);
        if (!localizedText) return book;
        if (localizedText.entryTexts.length !== book.entries.length)
          return book;
        return {
          ...book,
          name: localizedText.name,
          description: localizedText.description,
          entries: book.entries.map((entry, index) => ({
            ...entry,
            name: localizedText.entryTexts[index]?.name ?? entry.name,
            content: localizedText.entryTexts[index]?.content ?? entry.content,
          })),
        };
      }),
    [lorebooks, locale]
  );

  const createLorebook = useCallback(
    (name: string, description: string): Lorebook => {
      const newBook: Lorebook = {
        id: uuid(),
        name,
        description,
        entries: [],
        createdAt: Date.now(),
      };
      setLorebooks((prev) => [...prev, newBook]);
      return newBook;
    },
    []
  );

  const updateLorebook = useCallback(
    (
      lorebookId: LorebookId,
      patch: Partial<Pick<Lorebook, "name" | "description">>
    ) => {
      setLorebooks((prev) =>
        prev.map((book) =>
          book.id === lorebookId ? { ...book, ...patch } : book
        )
      );
    },
    []
  );

  const deleteLorebook = useCallback((lorebookId: LorebookId) => {
    setLorebooks((prev) => prev.filter((book) => book.id !== lorebookId));
  }, []);

  const addEntry = useCallback(
    (lorebookId: LorebookId, entry: Omit<LorebookEntry, "id">) => {
      setLorebooks((prev) =>
        prev.map((book) =>
          book.id === lorebookId
            ? { ...book, entries: [...book.entries, { ...entry, id: uuid() }] }
            : book
        )
      );
    },
    []
  );

  const updateEntry = useCallback(
    (
      lorebookId: LorebookId,
      entryId: LorebookEntryId,
      patch: Partial<Omit<LorebookEntry, "id">>
    ) => {
      setLorebooks((prev) =>
        prev.map((book) =>
          book.id === lorebookId
            ? {
                ...book,
                entries: book.entries.map((entry) =>
                  entry.id === entryId ? { ...entry, ...patch } : entry
                ),
              }
            : book
        )
      );
    },
    []
  );

  const deleteEntry = useCallback(
    (lorebookId: LorebookId, entryId: LorebookEntryId) => {
      setLorebooks((prev) =>
        prev.map((book) =>
          book.id === lorebookId
            ? {
                ...book,
                entries: book.entries.filter((entry) => entry.id !== entryId),
              }
            : book
        )
      );
    },
    []
  );

  const matchEntriesForText = useCallback(
    ({
      lorebookIds,
      text,
      recentMessages,
    }: {
      lorebookIds: LorebookId[];
      text: string;
      recentMessages: string[];
    }): MatchedEntry[] => {
      const relevantBooks = localizedLorebooks.filter((book) =>
        lorebookIds.includes(book.id)
      );
      return matchLorebookEntries({
        lorebooks: relevantBooks,
        text,
        recentMessages,
      });
    },
    [localizedLorebooks]
  );

  const value: LorebookStore = {
    lorebooks: localizedLorebooks,
    createLorebook,
    updateLorebook,
    deleteLorebook,
    addEntry,
    updateEntry,
    deleteEntry,
    matchEntriesForText,
  };

  return (
    <LorebookContext.Provider value={value}>
      {children}
    </LorebookContext.Provider>
  );
};

export const useLorebookStore = (): LorebookStore => {
  const store = useContext(LorebookContext);
  if (!store) {
    throw new Error("Lorebook context not found");
  }
  return store;
};
