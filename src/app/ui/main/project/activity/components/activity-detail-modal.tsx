import { Activity } from "@domain/activity";
import * as Dialog from "@app/components/dialog";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import { ActivityTypeBadge } from "./activity-type-badge";
import { ActivityBody } from "./activity-item";
import { absoluteTime, relativeTime } from "../activity-date";

export const ActivityDetailModal = ({
  activity,
  relatedActivities,
  onClose,
}: Props): JSX.Element | null => {
  if (!activity) return null;

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content aria-describedby={undefined}>
            <Dialog.Title className="mb-4 text-2xl">
              Activity details
            </Dialog.Title>
            <header className="flex items-center gap-3">
              <UserAvatar
                name={activity.user.name}
                image={activity.user.image}
                color={activity.user.color}
                size={40}
              />
              <div className="flex flex-col">
                <span className="font-primary-bold text-sm text-font">
                  {activity.user.name}
                </span>
                <span className="mt-0.5 flex items-center gap-2">
                  <ActivityTypeBadge type={activity.type} />
                  <span className="font-primary-light text-2xs text-font-subtlest">
                    {absoluteTime(activity.timestamp)}
                  </span>
                </span>
              </div>
            </header>

            <div className="mt-4 rounded bg-elevation-surface-sunken p-3">
              <ActivityBody activity={activity} full />
            </div>

            {relatedActivities.length > 0 && (
              <section className="mt-5">
                <h4 className="font-primary-bold text-sm uppercase text-font-subtle">
                  Related activities
                </h4>
                <ul className="mt-2 flex flex-col gap-2">
                  {relatedActivities.map((related) => (
                    <li
                      key={related.id}
                      className="flex items-center gap-3 rounded bg-elevation-surface-raised p-2"
                    >
                      <UserAvatar
                        name={related.user.name}
                        image={related.user.image}
                        color={related.user.color}
                        size={24}
                      />
                      <span className="truncate font-primary-light text-xs text-font-subtle">
                        {related.description}
                      </span>
                      <span className="ml-auto shrink-0 font-primary-light text-2xs text-font-subtlest">
                        {relativeTime(related.timestamp)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <Button
                  color="neutral"
                  variant="subtlest"
                  aria-label="Close activity details"
                >
                  Close
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface Props {
  activity: Activity | null;
  relatedActivities: Activity[];
  onClose: () => void;
}
