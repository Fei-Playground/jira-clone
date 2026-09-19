import { ScrollArea } from "@app/components/scroll-area";
import { useTranslation } from "@app/store/locale.store";
import { NarrativeBlock, NarrativeOrigin } from "@domain/narrative";

// The block's own text, read straight off the payload — this deliberately
// does NOT go through renderManuscript(), because this view's whole job is
// to show the RAW source material per block (what's really stored), not a
// rendered/composed sentence that mixes origins together.
const rawPayloadText = (payload: NarrativeBlock["payload"]): string => {
  switch (payload.kind) {
    case "chapterBreak":
      return `#${payload.index}`;
    case "sceneSetting":
      return payload.description;
    case "narration":
      return payload.text;
    case "dialogue":
      return payload.line;
    case "innerVoice":
      return payload.choiceLabel;
    case "beat":
      return JSON.stringify(payload.params);
    case "turningPoint":
      return payload.text;
    case "closing":
      return JSON.stringify(payload.params);
  }
};

const rawBlockText = (block: NarrativeBlock): string => rawPayloadText(block.payload);

const ORIGIN_BADGE_STYLE: Record<NarrativeOrigin, string> = {
  authored: "bg-background-success text-font-success",
  dialogue: "bg-background-info text-font-info",
  composed: "bg-background-warning text-font-warning",
};

// A creator-mode audit view: every block in the manuscript, in order, with
// a colored badge for its real origin (authored / dialogue / composed) and
// — for composed blocks — which template and which real state values fed
// it. This is the "complete view of where every paragraph came from" the
// per-block hover popover can't give at a glance across the WHOLE
// manuscript at once.
export const ProvenanceView = ({
  blocks,
}: {
  blocks: NarrativeBlock[];
}): JSX.Element => {
  const { t } = useTranslation();

  const originLabel = (origin: NarrativeOrigin): string => {
    switch (origin) {
      case "authored":
        return t("stories.manuscript.originAuthored");
      case "dialogue":
        return t("stories.manuscript.originDialogue");
      case "composed":
        return t("stories.manuscript.originComposed");
    }
  };

  const originBadgeText: Record<NarrativeOrigin, string> = {
    authored: t("stories.manuscript.badgeAuthored"),
    dialogue: t("stories.manuscript.badgeDialogue"),
    composed: t("stories.manuscript.badgeComposed"),
  };

  const counts = blocks.reduce(
    (acc, b) => {
      acc[b.provenance.origin] += 1;
      return acc;
    },
    { authored: 0, dialogue: 0, composed: 0 } as Record<NarrativeOrigin, number>
  );

  // Rewrite history (plan §10.4): every block that has been through a
  // structured revision (retone/rechoose/reenvironment) or a cosmetic
  // edit, with who changed it, what it was before, and the real
  // consequence it had — this is the "改写记录" section the audit view
  // was missing. It reads the SAME `revision` field the badge/undo button
  // in manuscript-view.tsx use, so this list and the inline badge never
  // disagree about what happened.
  const revisedBlocks = blocks.filter((b) => b.revision);

  return (
    <div className="flex max-h-[70vh] flex-col gap-3">
      <div>
        <p className="mb-1.5 text-2xs font-bold text-font-subtlest">
          {t("stories.manuscript.revision.auditSectionTitle")}
        </p>
        {revisedBlocks.length === 0 ? (
          <p className="text-2xs text-font-subtlest">
            {t("stories.manuscript.revision.auditNone")}
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {revisedBlocks.map((block) => (
              <li
                key={block.id}
                className="rounded-md border border-border-brand bg-background-brand-subtlest p-2 text-2xs text-font"
              >
                <p className="font-bold text-font-brand">
                  {t("stories.manuscript.revision.badge", {
                    name: block.revision!.byMemberName ?? "",
                  })}
                </p>
                {block.revision!.previousPayload && (
                  <p className="mt-0.5 text-font-subtlest">
                    {rawPayloadText(block.revision!.previousPayload)}
                  </p>
                )}
                {block.revision!.consequenceSummary?.map((line, i) => (
                  <p key={i} className="mt-0.5">
                    {line}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-2xs">
        {(["authored", "dialogue", "composed"] as NarrativeOrigin[]).map(
          (origin) => (
            <span
              key={origin}
              className={`rounded-full px-2 py-0.5 font-bold ${ORIGIN_BADGE_STYLE[origin]}`}
            >
              {originBadgeText[origin]} × {counts[origin]}
            </span>
          )
        )}
      </div>
      <div className="h-[55vh]">
        <ScrollArea className="pr-2">
          <ul className="flex flex-col gap-2">
            {blocks.length === 0 && (
              <li className="text-sm text-font-subtlest">
                {t("stories.manuscript.empty")}
              </li>
            )}
            {blocks.map((block, index) => (
              <li
                key={block.id}
                className="rounded-md border border-border bg-elevation-surface-raised p-3"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-2xs text-font-subtlest">
                    #{index + 1}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-2xs font-bold ${ORIGIN_BADGE_STYLE[block.provenance.origin]}`}
                  >
                    {originBadgeText[block.provenance.origin]}
                  </span>
                  {block.speakerName && (
                    <span className="text-2xs text-font-subtlest">
                      {block.speakerName}
                    </span>
                  )}
                  {block.sceneName && (
                    <span className="text-2xs text-font-subtlest">
                      · {block.sceneName}
                    </span>
                  )}
                  {block.hidden && (
                    <span className="text-2xs text-font-danger">
                      {t("stories.manuscript.hideBlock")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-font">
                  {block.editedText ?? rawBlockText(block)}
                </p>
                <p className="mt-1 text-2xs text-font-subtlest">
                  {originLabel(block.provenance.origin)}
                  {block.provenance.templateId &&
                    ` — ${block.provenance.templateId}`}
                  {block.provenance.inputs &&
                    Object.keys(block.provenance.inputs).length > 0 &&
                    ` (${Object.entries(block.provenance.inputs)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(", ")})`}
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
};
