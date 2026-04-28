import { useState, useRef, useEffect } from "react";
import { cx } from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const WatchersList = ({
  initialWatchers = [],
  availableUsers = [],
}: Props): JSX.Element => {
  const [watchers, setWatchers] = useState<User[]>(initialWatchers);
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleWatcher = (user: User) => {
    const isWatching = watchers.some((w) => w.id === user.id);
    if (isWatching) {
      setWatchers(watchers.filter((w) => w.id !== user.id));
    } else {
      setWatchers([...watchers, user]);
    }
  };

  const removeWatcher = (userId: string) => {
    setWatchers(watchers.filter((w) => w.id !== userId));
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cx(
          "flex w-full items-center gap-2 rounded-md p-2",
          "font-primary text-sm font-primary-bold text-font",
          "hover:bg-background-neutral"
        )}
        aria-label="Toggle watchers section"
      >
        <span className="text-lg">{isExpanded ? "▼" : "▶"}</span>
        <span>Watchers ({watchers.length})</span>
      </button>

      {isExpanded && (
        <div className="space-y-3 pl-4">
          {/* Current watchers */}
          {watchers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-font-subtle">Currently watching:</p>
              <div className="flex flex-wrap gap-2">
                {watchers.map((watcher) => (
                  <div
                    key={watcher.id}
                    className="flex items-center gap-2 rounded-full bg-background-neutral px-2 py-1"
                  >
                    <UserAvatar {...watcher} />
                    <span className="text-sm text-font">{watcher.name}</span>
                    <button
                      onClick={() => removeWatcher(watcher.id)}
                      className="ml-1 text-font-subtle hover:text-font"
                      aria-label={`Remove ${watcher.name} from watchers`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add watcher button/dropdown */}
          {availableUsers.length > 0 && (
            <div>
              <p className="mb-2 text-xs text-font-subtle">Add watcher:</p>
              <div className="grid grid-cols-2 gap-2">
                {availableUsers.map((user) => {
                  const isWatching = watchers.some((w) => w.id === user.id);
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleWatcher(user)}
                      className={cx(
                        "flex items-center gap-2 rounded-md border-2 px-2 py-2 transition-all",
                        "text-sm font-primary",
                        isWatching
                          ? "border-border-brand bg-background-brand-subtlest text-font"
                          : "border-border-neutral bg-background-neutral text-font hover:bg-background-neutral-hovered"
                      )}
                    >
                      <UserAvatar size="sm" {...user} />
                      <span className="truncate text-xs">{user.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden input to submit with form */}
      <input type="hidden" name="watchers" value={JSON.stringify(watchers)} />
    </div>
  );
};

interface Props {
  initialWatchers?: User[];
  availableUsers?: User[];
}
