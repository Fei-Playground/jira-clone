import { useState } from "react";
import * as Dialog from "@app/components/dialog";
import { useTranslation } from "@app/store/locale.store";
import { Locale } from "@app/locales";
import { NarrativeBlock, NarrativeRevisionInput, buildConsequenceSummary } from "@domain/narrative";
import { CharacterId } from "@domain/character";
import { DialogueChoice, Scene, getDialogueChoiceText } from "@domain/scene";
import {
  TimeOfDay,
  Weather,
  TIME_OF_DAY_VALUES,
  WEATHER_VALUES,
  TIME_OF_DAY_EMOJI,
  WEATHER_EMOJI,
} from "@domain/environment";

// Structured "rewrite the outcome" options for one manuscript block — the
// closed, predictable set described in the plan (§10.2). Which options are
// offered depends on the block's own kind, never on parsing free text:
//   - a `dialogue` block spoken by an NPC (speakerId set) -> retone
//   - a `sceneSetting` block -> reenvironment
//   - an `innerVoice` / `turningPoint` block that names an NPC with real,
//     currently-visible OTHER dialogue choices -> rechoose
// `beat` blocks never reach this component — manuscript-view.tsx only wires
// the trigger for kinds this covers.
export interface RevisionPickerProps {
  block: NarrativeBlock;
  scenes: Scene[];
  characters: { id: CharacterId; name: string }[];
  onRevise: (
    blockId: string,
    revision: NarrativeRevisionInput
  ) => { success: boolean; reason?: string };
  onClose: () => void;
}

export const RevisionPicker = ({
  block,
  scenes,
  characters,
  onRevise,
  onClose,
}: RevisionPickerProps): JSX.Element => {
  const { t, locale } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const scene = scenes.find((s) => s.id === block.sceneId);
  const speakerName =
    characters.find((c) => c.id === block.speakerId)?.name ?? block.speakerName ?? "";

  const commit = (revision: NarrativeRevisionInput): void => {
    const result = onRevise(block.id, revision);
    if (!result.success) {
      setError(
        result.reason ??
          (locale === Locale.ZH ? "这个修改没能成功。" : "This revision couldn't be applied.")
      );
      return;
    }
    onClose();
  };

  const retoneOptions: { tone: "warm" | "neutral" | "cold"; label: string }[] = [
    { tone: "warm", label: t("stories.manuscript.revision.toneWarm") },
    { tone: "neutral", label: t("stories.manuscript.revision.toneNeutral") },
    { tone: "cold", label: t("stories.manuscript.revision.toneCold") },
  ];

  // rechoose candidates: the NPC this block names, in the scene it happened
  // in, and every OTHER dialogue choice that NPC's card carries — never an
  // invented option. The choice that produced THIS block is excluded (it's
  // already the current state, re-picking it would be a no-op).
  const npc = scene?.npcs.find((n) => n.characterId === block.speakerId);
  const currentChoiceLabel =
    block.payload.kind === "innerVoice"
      ? block.payload.choiceLabel
      : block.payload.kind === "turningPoint"
        ? block.payload.text
        : undefined;
  const rechooseCandidates: DialogueChoice[] = (npc?.dialogueChoices ?? []).filter(
    (choice) => choice.label !== currentChoiceLabel
  );

  const showRetone = block.kind === "dialogue" && Boolean(block.speakerId);
  const showReenvironment = block.kind === "sceneSetting";
  const showRechoose =
    (block.kind === "innerVoice" || block.kind === "turningPoint") &&
    Boolean(npc) &&
    rechooseCandidates.length > 0;

  return (
    <Dialog.Content className="max-w-[480px]">
      <Dialog.Title>{t("stories.manuscript.revision.pickerTitle")}</Dialog.Title>
      <p className="mb-3 text-xs text-font-subtlest">
        {t("stories.manuscript.revision.pickerHint")}
      </p>
      {error && (
        <p className="mb-3 rounded-md bg-background-danger-subtlest p-2 text-xs text-font-danger">
          {error}
        </p>
      )}

      {showRetone && (
        <div className="mb-4">
          <p className="mb-2 text-2xs font-bold text-font-subtlest">
            {t("stories.manuscript.revision.retoneSection", { name: speakerName })}
          </p>
          <div className="flex flex-col gap-2">
            {retoneOptions.map((opt) => {
              const revision: NarrativeRevisionInput = {
                kind: "retone",
                characterId: block.speakerId as CharacterId,
                tone: opt.tone,
              };
              const consequence = buildConsequenceSummary(revision, locale, speakerName);
              return (
                <button
                  key={opt.tone}
                  type="button"
                  onClick={() => commit(revision)}
                  className="rounded-md border border-border bg-elevation-surface-raised p-2 text-left hover:bg-background-neutral-hovered"
                >
                  <span className="block text-sm font-medium text-font">{opt.label}</span>
                  <span className="block text-2xs text-font-subtlest">{consequence[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showRechoose && (
        <div className="mb-4">
          <p className="mb-2 text-2xs font-bold text-font-subtlest">
            {t("stories.manuscript.revision.rechooseSection", { name: speakerName })}
          </p>
          <div className="flex flex-col gap-2">
            {rechooseCandidates.map((choice) => {
              const localized = getDialogueChoiceText(choice.id, locale);
              const revision: NarrativeRevisionInput = {
                kind: "rechoose",
                characterId: block.speakerId as CharacterId,
                revokeFlags: [],
                setFlags: choice.setFlags,
                choiceId: choice.id,
                choiceLabel: localized?.label ?? choice.label,
                choiceLine: localized?.line ?? choice.line,
              };
              const consequence = buildConsequenceSummary(revision, locale, speakerName);
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => commit(revision)}
                  className="rounded-md border border-border bg-elevation-surface-raised p-2 text-left hover:bg-background-neutral-hovered"
                >
                  <span className="block text-sm font-medium text-font">
                    {localized?.label ?? choice.label}
                  </span>
                  <span className="block text-2xs text-font-subtlest">{consequence[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showReenvironment && (
        <div className="mb-4">
          <p className="mb-2 text-2xs font-bold text-font-subtlest">
            {t("stories.manuscript.revision.reenvironmentSection")}
          </p>
          <div className="flex flex-wrap gap-2">
            {TIME_OF_DAY_VALUES.map((tod: TimeOfDay) => {
              const revision: NarrativeRevisionInput = { kind: "reenvironment", timeOfDay: tod };
              return (
                <button
                  key={tod}
                  type="button"
                  onClick={() => commit(revision)}
                  className="rounded-md border border-border bg-elevation-surface-raised px-2 py-1 text-xs hover:bg-background-neutral-hovered"
                >
                  {TIME_OF_DAY_EMOJI[tod]}{" "}
                  {t(`stories.editor.condition.timeOfDay.${tod}` as never)}
                </button>
              );
            })}
            {WEATHER_VALUES.map((w: Weather) => {
              const revision: NarrativeRevisionInput = { kind: "reenvironment", weather: w };
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => commit(revision)}
                  className="rounded-md border border-border bg-elevation-surface-raised px-2 py-1 text-xs hover:bg-background-neutral-hovered"
                >
                  {WEATHER_EMOJI[w]}{" "}
                  {t(`stories.editor.condition.weather.${w}` as never)}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-2xs text-font-subtlest">
            {buildConsequenceSummary({ kind: "reenvironment" }, locale, "")[0]}
          </p>
        </div>
      )}

      {!showRetone && !showRechoose && !showReenvironment && (
        <p className="text-sm text-font-subtlest">
          {t("stories.manuscript.revision.noOptions")}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-background-neutral px-3 py-1 text-xs text-font hover:bg-background-neutral-hovered"
        >
          {t("stories.manuscript.cancelEdit")}
        </button>
      </div>
    </Dialog.Content>
  );
};

