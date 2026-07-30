import cx from "classix";
import { User } from "@domain/user";
import { Search } from "@app/ui/main/project/board/search";
import { UserAvatarList } from "./avatar-list";
import { SelectSort } from "./select-sort";
import { SelectPriorityFilter } from "./select-priority-filter";

export type BoardHeaderVariant = "balanced" | "raised" | "compact";

export const BoardHeader = ({
  users,
  variant = "balanced",
}: BoardHeaderProps): JSX.Element => {
  return (
    <section
      aria-label="Board tools"
      data-variant={variant}
      className={cx(variantStyles[variant].shell)}
    >
      <div className={cx(variantStyles[variant].inner)}>
        <div className={cx(variantStyles[variant].filters)}>
          <Search />
          <SelectPriorityFilter
            className={variantStyles[variant].priorityClass}
          />
          <SelectSort />
        </div>
        <div className={cx(variantStyles[variant].avatars)}>
          <UserAvatarList users={users} />
        </div>
      </div>
    </section>
  );
};

interface BoardHeaderProps {
  users: User[];
  variant?: BoardHeaderVariant;
}

const variantStyles: Record<
  BoardHeaderVariant,
  {
    shell: string;
    inner: string;
    filters: string;
    avatars: string;
    priorityClass?: string;
  }
> = {
  /** Flat sticky tool row — default, matches the current product look */
  balanced: {
    shell: cx(
      "sticky top-0 z-20 -mx-1 mb-1 bg-elevation-surface/95 px-1 pb-3 pt-1",
      "backdrop-blur-sm supports-[backdrop-filter]:bg-elevation-surface/80",
      "border-b border-border-disabled"
    ),
    inner:
      "flex flex-wrap items-center justify-between gap-x-6 gap-y-3",
    filters: "flex min-w-0 flex-wrap items-center gap-3",
    avatars: "flex shrink-0 items-center",
  },
  /** Elevated bar — tools sit in a raised surface with soft shadow */
  raised: {
    shell: cx("sticky top-0 z-20 mb-2 bg-elevation-surface pb-2 pt-1"),
    inner: cx(
      "flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-lg",
      "border border-border-disabled bg-elevation-surface-raised px-4 py-3 shadow-sm"
    ),
    filters: "flex min-w-0 flex-wrap items-center gap-3",
    avatars: "flex shrink-0 items-center border-l border-border-disabled pl-4",
    priorityClass: "shadow-xs",
  },
  /** Compact strip — denser controls, stronger divider under the bar */
  compact: {
    shell: cx(
      "sticky top-0 z-20 -mx-1 mb-1 bg-elevation-surface px-1",
      "border-b-2 border-border-brand pb-2 pt-0.5"
    ),
    inner:
      "flex flex-wrap items-center justify-between gap-x-4 gap-y-2",
    filters: "flex min-w-0 flex-wrap items-center gap-2",
    avatars: "flex shrink-0 items-center",
    priorityClass: "h-9 px-2.5",
  },
};
