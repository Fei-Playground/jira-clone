import { useMemo, useState } from "react";
import cx from "classix";
import { IssueActivity, IssueActivityType } from "@domain/issue";
import { UserAvatar } from "@app/components/user-avatar";
import { formatDateTime } from "@utils/formatDateTime";

type Filter = "all" | "comments" | "changes";

const COMMENT_TYPES: IssueActivityType[] = ["comment_added"];

export const ActivityTimeline = ({ activities }: Props): JSX.Element => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "comments") {
      return activities.filter((activity) =>
        COMMENT_TYPES.includes(activity.type)
      );
    }
    if (filter === "changes") {
      return activities.filter(
        (activity) => !COMMENT_TYPES.includes(activity.type)
      );
    }
    return activities;
  }, [activities, filter]);

  return (
    <section aria-labelledby="activity-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p id="activity-heading" className="mb-0 font-primary-black text-font">
          Activity
        </p>
        <div
          className="flex gap-1 rounded bg-background-neutral p-1"
          role="tablist"
          aria-label="Filter activity"
        >
          {(
            [
              ["all", "All"],
              ["comments", "Comments"],
              ["changes", "Changes"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={cx(
                "rounded px-2 py-1 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand",
                filter === value
                  ? "bg-elevation-surface font-primary-bold text-font shadow-sm"
                  : "text-font-subtlest hover:text-font"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-font-subtlest" role="status">
          No activity yet.
        </p>
      ) : (
        <ol className="space-y-4 border-l border-border pl-4">
          {filtered.map((activity) => (
            <li key={activity.id} className="relative">
              <span
                className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-border-brand"
                aria-hidden
              />
              <div className="flex items-start gap-3">
                <UserAvatar {...activity.user} size={28} />
                <div className="min-w-0">
                  <p className="m-0 text-sm text-font">
                    <span className="font-primary-bold">
                      {activity.user.name}
                    </span>{" "}
                    <span className="font-primary-light">
                      {activity.message}
                    </span>
                  </p>
                  <p className="m-0 mt-1 text-xs text-font-subtlest">
                    <time dateTime={new Date(activity.createdAt).toISOString()}>
                      {formatDateTime(activity.createdAt)}
                    </time>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

interface Props {
  activities: IssueActivity[];
}
