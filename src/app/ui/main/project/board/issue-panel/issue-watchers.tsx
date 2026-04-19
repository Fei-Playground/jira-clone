import { useState } from "react";
import { Watcher } from "@domain/watcher";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import { Button } from "@app/components/button";
import { HiEye, HiEyeOff } from "react-icons/hi";
import cx from "classix";

export const IssueWatchers = ({ watchers, users, currentUserId }: Props): JSX.Element => {
  const [isWatching, setIsWatching] = useState(
    watchers?.some((w) => w.userId === currentUserId) || false
  );

  const getWatcherUsers = (): User[] => {
    if (!watchers) return [];
    return watchers
      .map((watcher) => users.find((user) => user.id === watcher.userId))
      .filter((user): user is User => Boolean(user));
  };

  const watcherUsers = getWatcherUsers();
  const isCurrentUserWatching = watchers?.some(
    (w) => w.userId === currentUserId
  ) || false;

  const handleToggleWatch = () => {
    setIsWatching(!isWatching);
    // In a real app, this would submit a form or call an action
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-2xs font-primary-light text-font-subtle">
          {watcherUsers.length} watcher{watcherUsers.length !== 1 ? "s" : ""}
        </p>
        <Button
          onClick={handleToggleWatch}
          size="sm"
          variant={isWatching ? "primary" : "neutral"}
          className="flex items-center gap-1"
          aria-label={isWatching ? "Unwatch issue" : "Watch issue"}
        >
          {isWatching ? (
            <>
              <HiEye className="w-4 h-4" />
              Watching
            </>
          ) : (
            <>
              <HiEyeOff className="w-4 h-4" />
              Watch
            </>
          )}
        </Button>
      </div>
      {watcherUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {watcherUsers.map((user) => (
            <div key={user.id} title={user.name}>
              <UserAvatar {...user} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Props {
  watchers?: Watcher[];
  users: User[];
  currentUserId: string;
}
