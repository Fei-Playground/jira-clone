import { useMemo, useState } from "react";
import cx from "classix";
import { User, UserId } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { useProjectStore } from "@app/ui/main/project";
import { UserAvatar } from "@app/components/user-avatar";
import { Button } from "@app/components/button";

export const WatchersField = ({ initWatchers }: Props): JSX.Element => {
  const { user } = useUserStore();
  const projectStore = useProjectStore();
  const projectUsers = projectStore.project.users;
  const [watcherIds, setWatcherIds] = useState<UserId[]>(
    initWatchers.map((watcher) => watcher.id)
  );

  const watchers = useMemo(
    () =>
      watcherIds
        .map((id) => projectUsers.find((projectUser) => projectUser.id === id))
        .filter((projectUser): projectUser is User => Boolean(projectUser)),
    [watcherIds, projectUsers]
  );

  const isWatching = watcherIds.includes(user.id);

  const toggleSelf = () => {
    setWatcherIds((current) =>
      current.includes(user.id)
        ? current.filter((id) => id !== user.id)
        : [...current, user.id]
    );
  };

  const addWatcher = (userId: UserId) => {
    setWatcherIds((current) =>
      current.includes(userId) ? current : [...current, userId]
    );
  };

  const removeWatcher = (userId: UserId) => {
    setWatcherIds((current) => current.filter((id) => id !== userId));
  };

  const availableToAdd = projectUsers.filter(
    (projectUser) => !watcherIds.includes(projectUser.id)
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p id="watchers-label" className="mb-0">
          Watchers
        </p>
        <Button
          type="button"
          color="neutral"
          variant="subtlest"
          onClick={toggleSelf}
          aria-pressed={isWatching}
          aria-label={
            isWatching ? "Stop watching this issue" : "Watch this issue"
          }
          className="!px-2 !py-1 text-xs"
        >
          {isWatching ? "Watching" : "Watch"}
        </Button>
      </div>

      <input type="hidden" name="watchers" value={JSON.stringify(watcherIds)} />

      {watchers.length === 0 ? (
        <p className="text-xs text-font-subtlest" role="status">
          No one is watching yet.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2" aria-labelledby="watchers-label">
          {watchers.map((watcher) => (
            <li key={watcher.id}>
              <div
                className={cx(
                  "flex items-center gap-2 rounded-full bg-background-neutral py-1 pl-1 pr-2",
                  watcher.id === user.id && "ring-2 ring-border-brand"
                )}
              >
                <UserAvatar {...watcher} size={28} />
                <span className="max-w-[90px] truncate text-xs">
                  {watcher.name}
                  {watcher.id === user.id ? " (you)" : ""}
                </span>
                <button
                  type="button"
                  onClick={() => removeWatcher(watcher.id)}
                  className="rounded px-1 text-xs text-font-subtlest hover:text-font-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand"
                  aria-label={`Remove ${watcher.name} from watchers`}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {availableToAdd.length > 0 && (
        <div className="mt-3">
          <label htmlFor="add-watcher" className="sr-only">
            Add watcher
          </label>
          <select
            id="add-watcher"
            className="w-full rounded border-none bg-background-neutral px-2 py-1.5 text-sm text-font focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                addWatcher(e.target.value);
                e.target.value = "";
              }
            }}
            aria-label="Add a watcher"
          >
            <option value="" disabled>
              Add watcher…
            </option>
            {availableToAdd.map((projectUser) => (
              <option key={projectUser.id} value={projectUser.id}>
                {projectUser.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

interface Props {
  initWatchers: User[];
}
