import { useRef, useState } from "react";
import { RiUploadLine, RiDownloadLine } from "react-icons/ri";
import cx from "classix";
import { toast } from "react-toastify";
import {
  Character,
  toCharacterCard,
  fromCharacterCard,
  CardImportErrorReason,
} from "@domain/character";
import { Lorebook } from "@domain/lorebook";
import { useTranslation } from "@app/store/locale.store";

export const downloadCharacterCard = (
  character: Character,
  lorebooks: Lorebook[]
): void => {
  const card = toCharacterCard(character, lorebooks);
  const blob = new Blob([JSON.stringify(card, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${character.name.trim().replace(/\s+/g, "-").toLowerCase() || "companion"}.card.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const ERROR_KEY_BY_REASON: Record<CardImportErrorReason, string> = {
  invalid_json: "companions.card.importErrorInvalidJson",
  unrecognized_spec: "companions.card.importErrorUnrecognizedSpec",
  missing_name: "companions.card.importErrorMissingName",
};

// A drop zone + file picker for importing a character card JSON. Existing
// character names are passed in so a same-name import can be auto-renamed to
// "<name> (copy)" instead of silently overwriting.
export const CharacterCardImportZone = ({
  existingNames,
  onImport,
}: {
  existingNames: string[];
  onImport: (
    character: Omit<Character, "id" | "createdAt">,
    lorebooks: Lorebook[]
  ) => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = fromCharacterCard(parsed);

      if ("error" in result) {
        toast.error(t(ERROR_KEY_BY_REASON[result.error] as never));
        return;
      }

      let name = result.character.name;
      if (existingNames.includes(name)) {
        name = `${name}${t("companions.card.importDuplicateSuffix")}`;
      }

      onImport({ ...result.character, name }, result.lorebooks);
      toast.success(t("companions.card.importSuccess", { name }));
    } catch {
      toast.error(t(ERROR_KEY_BY_REASON.invalid_json as never));
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={cx(
        "flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border p-3 text-xs text-font-subtlest hover:bg-background-neutral",
        isDragOver &&
          "border-border-brand bg-background-brand-subtlest text-font-brand"
      )}
      onClick={() => fileInputRef.current?.click()}
    >
      <RiUploadLine size={16} className="shrink-0" />
      <span>{t("companions.card.importCardHint")}</span>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
        aria-label={t("companions.card.importCard")}
      />
    </div>
  );
};

export const ExportCharacterCardButton = ({
  character,
  lorebooks,
}: {
  character: Character;
  lorebooks: Lorebook[];
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => downloadCharacterCard(character, lorebooks)}
      aria-label={t("companions.card.exportCard")}
      className="flex items-center gap-1.5 rounded-md p-2 text-xs text-font-subtlest hover:bg-background-neutral hover:text-font"
    >
      <RiDownloadLine size={16} />
      {t("companions.card.exportCard")}
    </button>
  );
};
