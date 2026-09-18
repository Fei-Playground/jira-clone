import { PartyActivityEntry } from "@domain/party";
import * as Dialog from "@app/components/dialog";
import { ScrollArea } from "@app/components/scroll-area";
import { useTranslation } from "@app/store/locale.store";
import { useStoryStore } from "./story.store";

const ACTIVITY_ICON: Record<PartyActivityEntry["kind"], string> = {
  questAccepted: "🎯",
  questCompleted: "✅",
  questReadyToTurnIn: "📬",
  sceneUnlocked: "🔓",
  sceneEntered: "🚪",
  itemObtained: "🎒",
  storyEventFired: "📖",
};

const activityLine = (
  entry: PartyActivityEntry,
  t: ReturnType<typeof useTranslation>["t"]
): string => {
  const params = { member: entry.memberName, ...entry.params };
  switch (entry.kind) {
    case "questAccepted":
      return t("stories.party.activity.questAccepted", params as never);
    case "questCompleted":
      return t("stories.party.activity.questCompleted", params as never);
    case "questReadyToTurnIn":
      return t("stories.party.activity.questReadyToTurnIn", params as never);
    case "sceneUnlocked":
      return t("stories.party.activity.sceneUnlocked", params as never);
    case "itemObtained":
      return t("stories.party.activity.itemObtained", params as never);
    case "storyEventFired":
      return t("stories.party.activity.storyEventFired", params as never);
    default:
      return entry.memberName;
  }
};

// A real, ordered log of who did what — built from the same ProgressEffect[]
// every quest/scene/item/event action already produces (see
// party.activity.ts), just attributed to whoever was at the controls when it
// happened. Not a decorative feed: every line traces back to something the
// player actually did.
export const PartyActivityPanel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { progress } = useStoryStore();
  const entries = [...(progress?.activityLog ?? [])].reverse();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[480px]">
            <Dialog.Title>{t("stories.party.activityTitle")}</Dialog.Title>
            {entries.length === 0 ? (
              <p className="text-sm text-font-subtlest">
                {t("stories.party.activityEmpty")}
              </p>
            ) : (
              <div className="max-h-[400px]">
                <ScrollArea>
                  <ul className="flex flex-col gap-2 pr-2">
                    {entries.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-start gap-2 rounded-md border border-border bg-elevation-surface-raised p-2.5"
                      >
                        <span className="text-base">
                          {ACTIVITY_ICON[entry.kind]}
                        </span>
                        <p className="flex-1 text-sm text-font">
                          {activityLine(entry, t)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
