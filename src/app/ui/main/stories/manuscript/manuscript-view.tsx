import { useEffect, useMemo, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  RiInformationLine,
  RiEyeOffLine,
  RiEyeLine,
  RiPencilLine,
} from "react-icons/ri";
import { Tooltip } from "@app/components/tooltip";
import { useTranslation } from "@app/store/locale.store";
import { NarrativeBlock } from "@domain/narrative";
import {
  ManuscriptOptions,
  ManuscriptMode,
  NarrativePov,
  NarrativeTense,
  renderManuscript,
} from "./manuscript.renderer";
import { ManuscriptLine } from "./manuscript-block";

export interface ManuscriptViewProps {
  blocks: NarrativeBlock[];
  options: ManuscriptOptions;
  onOptionsChange: (options: ManuscriptOptions) => void;
  creatorMode: boolean;
  onEditBlock?: (blockId: string, text: string) => void;
  onToggleHidden?: (blockId: string) => void;
}

export const ManuscriptView = ({
  blocks,
  options,
  onOptionsChange,
  creatorMode,
  onEditBlock,
  onToggleHidden,
}: ManuscriptViewProps): JSX.Element => {
  const { t, locale } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const prevBlockCount = useRef(0);

  const rendered = useMemo(
    () => renderManuscript(blocks, options, locale),
    [blocks, options, locale]
  );

  useEffect(() => {
    if (blocks.length > prevBlockCount.current) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    prevBlockCount.current = blocks.length;
  }, [blocks.length]);

  const startEdit = (block: NarrativeBlock, currentText: string): void => {
    setEditingBlockId(block.id);
    setEditText(block.editedText ?? currentText);
  };

  const saveEdit = (): void => {
    if (editingBlockId && onEditBlock) {
      onEditBlock(editingBlockId, editText);
    }
    setEditingBlockId(null);
  };

  const visibleBlockIds = new Set(rendered.lines.map((l) => l.blockId));
  const originLabel = (block: NarrativeBlock): string => {
    switch (block.provenance.origin) {
      case "authored":
        return t("stories.manuscript.originAuthored");
      case "dialogue":
        return t("stories.manuscript.originDialogue");
      case "composed":
        return t("stories.manuscript.originComposed");
    }
  };

  return (
    <div className="flex h-full flex-col bg-elevation-surface">
      <div className="border-border-default flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
        <h2 className="font-primary-bold text-sm text-font">
          {t("stories.manuscript.title")}
        </h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <SegmentedToggle
            value={options.mode}
            onChange={(mode: ManuscriptMode) =>
              onOptionsChange({ ...options, mode })
            }
            options={[
              { value: "novel", label: t("stories.manuscript.modeNovel") },
              {
                value: "screenplay",
                label: t("stories.manuscript.modeScreenplay"),
              },
            ]}
          />
          <SegmentedToggle
            value={options.pov}
            onChange={(pov: NarrativePov) =>
              onOptionsChange({ ...options, pov })
            }
            options={[
              { value: "third", label: t("stories.manuscript.povThird") },
              { value: "first", label: t("stories.manuscript.povFirst") },
            ]}
          />
          <SegmentedToggle
            value={options.tense}
            onChange={(tense: NarrativeTense) =>
              onOptionsChange({ ...options, tense })
            }
            options={[
              { value: "past", label: t("stories.manuscript.tensePast") },
              { value: "present", label: t("stories.manuscript.tensePresent") },
            ]}
          />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              aria-label={t("stories.manuscript.whereFrom")}
              className="flex h-6 w-6 items-center justify-center rounded-full text-icon hover:bg-background-brand-subtlest hover:text-icon-brand"
            >
              <RiInformationLine size={16} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={6}
                className="z-50 max-w-[280px] rounded-md bg-elevation-surface-overlay p-3 text-xs text-font shadow-md"
              >
                {t("stories.manuscript.provenanceNote")}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4">
        {rendered.lines.length === 0 ? (
          <p className="text-center text-sm text-font-subtlest">
            {t("stories.manuscript.empty")}
          </p>
        ) : (
          blocks
            .filter(
              (block) =>
                visibleBlockIds.has(block.id) || (creatorMode && block.hidden)
            )
            .map((block) => {
              const lines = rendered.lines.filter(
                (l) => l.blockId === block.id
              );
              const isHidden = Boolean(block.hidden);
              return (
                <div
                  key={block.id}
                  className={`group relative ${isHidden ? "opacity-40" : ""}`}
                >
                  {creatorMode && (
                    <div className="absolute -left-8 top-0 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <Tooltip title={originLabel(block)}>
                        <button
                          type="button"
                          aria-label={t("stories.manuscript.whereFrom")}
                          className="text-icon-subtlest flex h-5 w-5 items-center justify-center rounded hover:bg-background-neutral"
                        >
                          <RiInformationLine size={13} />
                        </button>
                      </Tooltip>
                      {lines.length > 0 &&
                        lines[0].type === "prose" &&
                        onEditBlock && (
                          <button
                            type="button"
                            aria-label={t("stories.manuscript.editBlock")}
                            onClick={() => startEdit(block, lines[0].text)}
                            className="text-icon-subtlest flex h-5 w-5 items-center justify-center rounded hover:bg-background-neutral"
                          >
                            <RiPencilLine size={13} />
                          </button>
                        )}
                      {onToggleHidden && (
                        <button
                          type="button"
                          aria-label={
                            isHidden
                              ? t("stories.manuscript.unhideBlock")
                              : t("stories.manuscript.hideBlock")
                          }
                          onClick={() => onToggleHidden(block.id)}
                          className="text-icon-subtlest flex h-5 w-5 items-center justify-center rounded hover:bg-background-neutral"
                        >
                          {isHidden ? (
                            <RiEyeLine size={13} />
                          ) : (
                            <RiEyeOffLine size={13} />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  {editingBlockId === block.id ? (
                    <div className="mb-3 flex flex-col gap-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full rounded-md bg-background-input p-2 text-sm text-font outline outline-2 outline-border-input focus:outline-border-brand"
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="rounded-md bg-background-brand-bold px-3 py-1 text-xs text-font-inverse hover:bg-background-brand-bold-hovered"
                        >
                          {t("stories.manuscript.saveEdit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingBlockId(null)}
                          className="rounded-md bg-background-neutral px-3 py-1 text-xs text-font hover:bg-background-neutral-hovered"
                        >
                          {t("stories.manuscript.cancelEdit")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    lines.map((line, i) => (
                      <ManuscriptLine key={`${block.id}-${i}`} line={line} />
                    ))
                  )}
                </div>
              );
            })
        )}
      </div>

      <div className="border-border-default flex items-center justify-between border-t px-4 py-1.5">
        <label className="flex items-center gap-1.5 text-2xs text-font-subtlest">
          <input
            type="checkbox"
            checked={options.includeMinorBeats}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                includeMinorBeats: e.target.checked,
              })
            }
            className="h-3 w-3"
          />
          {t("stories.manuscript.includeMinorBeats")}
        </label>
        <span className="text-2xs text-font-subtlest">
          {t("stories.manuscript.wordCount", { count: rendered.wordCount })}
        </span>
      </div>
    </div>
  );
};

const SegmentedToggle = <T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}): JSX.Element => (
  <div className="flex overflow-hidden rounded-md bg-background-neutral p-0.5">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        aria-pressed={value === opt.value}
        className={`rounded px-2 py-0.5 text-2xs font-medium transition-colors ${
          value === opt.value
            ? "bg-elevation-surface text-font-brand shadow-xs"
            : "text-font-subtlest hover:text-font"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);
