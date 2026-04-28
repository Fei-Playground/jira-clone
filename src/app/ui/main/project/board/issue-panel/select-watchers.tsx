import { useState, useEffect } from "react";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import * as Popover from "@radix-ui/react-popover";
import { cx } from "classix";

const AVAILABLE_TEAM_MEMBERS: User[] = [
  {
    id: "user-1",
    name: "Daniel Serrano",
    image: "https://i.pravatar.cc/150?img=1",
    color: "#6366f1",
  },
  {
    id: "user-2",
    name: "Woody",
    image: "https://i.pravatar.cc/150?img=2",
    color: "#8b5cf6",
  },
  {
    id: "user-3",
    name: "Buzz Lightyear",
    image: "https://i.pravatar.cc/150?img=3",
    color: "#ec4899",
  },
  {
    id: "user-4",
    name: "Rex",
    image: "https://i.pravatar.cc/150?img=4",
    color: "#06b6d4",
  },
  {
    id: "user-5",
    name: "Hamm",
    image: "https://i.pravatar.cc/150?img=5",
    color: "#f59e0b",
  },
];

export const SelectWatchers = ({
  initWatchers = [],
  readOnly = false,
}: Props): JSX.Element => {
  const [watchers, setWatchers] = useState<User[]>(initWatchers);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setWatchers(initWatchers);
  }, [initWatchers]);

  useEffect(() => {
    const input = document.querySelector(
      'input[name="watchers"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = JSON.stringify(watchers);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, [watchers]);

  const handleToggleWatcher = (user: User) => {
    setWatchers((prev) =>
      prev.some((w) => w.id === user.id)
        ? prev.filter((w) => w.id !== user.id)
        : [...prev, user]
    );
  };

  const handleRemoveWatcher = (userId: string) => {
    setWatchers((prev) => prev.filter((w) => w.id !== userId));
  };

  if (readOnly) {
    return (
      <div className="flex flex-wrap gap-1">
        {watchers.length === 0 ? (
          <span className="text-sm text-font-subtle">No watchers</span>
        ) : (
          watchers.map((watcher) => (
            <div key={watcher.id} title={watcher.name}>
              <UserAvatar {...watcher} />
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <>
      <input
        type="hidden"
        name="watchers"
        value={JSON.stringify(watchers)}
      />
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex h-8 items-center gap-1 rounded-full bg-background-neutral px-2 py-1 hover:bg-background-neutral-hovered"
          >
            {watchers.length === 0 ? (
              <span className="text-sm text-font-subtle">Add watchers</span>
            ) : (
              <>
                {watchers.slice(0, 3).map((watcher) => (
                  <div key={watcher.id} title={watcher.name}>
                    <UserAvatar {...watcher} />
                  </div>
                ))}
                {watchers.length > 3 && (
                  <div className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-background-brand-bold text-2xs font-primary-bold text-font-inverse">
                    +{watchers.length - 3}
                  </div>
                )}
              </>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-80 rounded-lg border border-border-brand bg-elevation-surface-raised p-3 shadow-lg"
            sideOffset={8}
          >
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-sm font-primary-bold">Watchers</p>
                <p className="text-2xs text-font-subtle">
                  Be notified of changes to this issue
                </p>
              </div>

              <div className="max-h-64 space-y-1 overflow-y-auto">
                {AVAILABLE_TEAM_MEMBERS.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-background-neutral-hovered"
                  >
                    <input
                      type="checkbox"
                      checked={watchers.some((w) => w.id === member.id)}
                      onChange={() => handleToggleWatcher(member)}
                      className="cursor-pointer"
                    />
                    <UserAvatar {...member} />
                    <span className="text-sm">{member.name}</span>
                  </label>
                ))}
              </div>

              {watchers.length > 0 && (
                <div className="border-t border-border-brand pt-2">
                  <p className="mb-2 text-2xs font-primary-bold text-font-subtle">
                    Watching ({watchers.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {watchers.map((watcher) => (
                      <div
                        key={watcher.id}
                        className="flex items-center gap-1 rounded-full bg-background-brand-subtlest px-2 py-0.5"
                      >
                        <UserAvatar {...watcher} size="small" />
                        <span className="text-2xs">{watcher.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveWatcher(watcher.id)}
                          className="ml-1 text-font-subtle hover:text-font"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
};

interface Props {
  initWatchers?: User[];
  readOnly?: boolean;
}
