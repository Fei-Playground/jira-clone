import { NpcRelationship } from "@domain/player-progress";
import { Tooltip } from "@app/components/tooltip";
import { useTranslation } from "@app/store/locale.store";

// Maps a real affinity/mood pair to a face + a short label — this is a
// direct reading of computed state, not a random or decorative sticker.
// Mood dominates the face (it's the NPC's immediate tone); affinity
// determines the tooltip's trust-level phrase.
const moodFace = (mood: number): string => {
  if (mood >= 75) return "😄";
  if (mood >= 55) return "🙂";
  if (mood >= 35) return "😐";
  if (mood >= 15) return "😒";
  return "😠";
};

const affinityLevelKey = (affinity: number): string => {
  if (affinity >= 75) return "stories.relationship.trustHigh";
  if (affinity >= 40) return "stories.relationship.trustMedium";
  if (affinity >= 10) return "stories.relationship.trustLow";
  return "stories.relationship.trustNone";
};

export const RelationshipIndicator = ({
  relationship,
}: {
  relationship: NpcRelationship | undefined;
}): JSX.Element | null => {
  const { t } = useTranslation();
  if (!relationship) return null;

  return (
    <Tooltip
      title={`${t(affinityLevelKey(relationship.affinity) as never)} · ${t(
        "stories.relationship.affinityValue",
        { value: relationship.affinity }
      )}`}
    >
      <span
        aria-label={t("stories.relationship.ariaLabel", {
          affinity: relationship.affinity,
        })}
        className="text-sm"
      >
        {moodFace(relationship.mood)}
      </span>
    </Tooltip>
  );
};
