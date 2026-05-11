import { useMemo } from "react";
import cx from "classix";
import { Issue } from "@domain/issue";
import { UserAvatar } from "@app/components/user-avatar";
import { Tooltip } from "@app/components/tooltip";
import { PriorityIcon } from "@app/components/priority-icon";
import {
  calculateBarPosition,
  formatDateRange,
  getBarColorClass,
} from "@utils/gantt-utils";

export const GanttBar = ({
  issue,
  timelineStart,
  pixelsPerDay,
}: Props): JSX.Element => {
  const { left, width } = useMemo(
    () =>
      calculateBarPosition(
        issue.createdAt,
        issue.updatedAt,
        timelineStart,
        pixelsPerDay
      ),
    [issue.createdAt, issue.updatedAt, timelineStart, pixelsPerDay]
  );

  const createdDate = new Date(issue.createdAt);
  const updatedDate = new Date(issue.updatedAt);
  const dateRangeStr = formatDateRange(createdDate, updatedDate);

  const barColorClass = getBarColorClass(issue.categoryType);

  // Determine if bar is wide enough to show full content
  const isWideBar = width >= 120;
  const isMediumBar = width >= 60;

  return (
    <Tooltip
      title={`${issue.name}\n${dateRangeStr}\nPriority: ${issue.priority?.name || 'Not set'}`}
      show={true}
    >
      <div
        className={cx(
          "absolute top-1 h-8 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center border border-white/10 hover:border-white/30 group overflow-hidden",
          barColorClass
        )}
        style={{
          left: `${left}px`,
          width: `${Math.max(width, 28)}px`,
          minWidth: "28px",
        }}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Left accent line */}
        <div className={cx(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
          issue.priority?.id === "high" && "bg-icon-accent-red",
          issue.priority?.id === "medium" && "bg-icon-accent-yellow",
          issue.priority?.id === "low" && "bg-icon-accent-green",
          !issue.priority && "bg-white/30"
        )} />
        
        <div className="flex items-center gap-1.5 overflow-hidden w-full px-3 relative z-10">
          {/* Avatar with ring effect */}
          <div className="flex-shrink-0 opacity-90 group-hover:opacity-100 transition-all duration-200 ring-1 ring-white/20 rounded-full group-hover:ring-white/40">
            <UserAvatar
              name={issue.asignee.name}
              image={issue.asignee.image}
              size={20}
              tooltip={true}
            />
          </div>
          
          {/* Priority icon for medium+ bars */}
          {isMediumBar && issue.priority && (
            <div className="flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <PriorityIcon priority={issue.priority.id} size={14} />
            </div>
          )}
          
          {/* Issue name for wide bars */}
          {isWideBar && (
            <span className="truncate text-xs font-primary-light text-font-inverse whitespace-nowrap overflow-hidden group-hover:font-primary transition-all duration-200 drop-shadow-sm">
              {issue.name}
            </span>
          )}
        </div>
        
        {/* Progress indicator dot */}
        <div className={cx(
          "absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity",
          issue.categoryType === "DONE" && "bg-white",
          issue.categoryType === "IN_PROGRESS" && "bg-white animate-pulse",
          issue.categoryType === "TODO" && "bg-white/50"
        )} />
      </div>
    </Tooltip>
  );
};

interface Props {
  issue: Issue;
  timelineStart: Date;
  pixelsPerDay: number;
}
