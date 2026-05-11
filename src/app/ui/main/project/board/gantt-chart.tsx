import { useMemo } from "react";
import { Issue } from "@domain/issue";
import { Category } from "@domain/category";
import { ScrollArea } from "@app/components/scroll-area";
import {
  calculateTimelineRange,
  calculateTimelineWidth,
  formatDateForTimeline,
} from "@utils/gantt-utils";
import { GanttBar } from "./gantt-bar";
import cx from "classix";

const PIXELS_PER_DAY = 40;
const ROW_HEIGHT = 40;

export const GanttChart = ({ categories }: Props): JSX.Element => {

  // Flatten all issues from all categories
  const allIssues = useMemo(
    () => categories.flatMap((category) => category.issues),
    [categories]
  );

  // Calculate timeline range
  const timelineRange = useMemo(
    () => calculateTimelineRange(allIssues),
    [allIssues]
  );

  const timelineWidth = useMemo(
    () => calculateTimelineWidth(timelineRange, PIXELS_PER_DAY),
    [timelineRange]
  );

  // Generate date markers for the timeline header
  const dateMarkers = useMemo(() => {
    const markers = [];
    const current = new Date(timelineRange.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (current <= timelineRange.end) {
      const currentDate = new Date(current);
      currentDate.setHours(0, 0, 0, 0);
      markers.push({
        date: new Date(current),
        dayOfWeek: current.getDay(),
        isToday: currentDate.getTime() === today.getTime(),
      });
      current.setDate(current.getDate() + 1);
    }

    return markers;
  }, [timelineRange]);

  // Find today's index for the "today" marker line
  const todayIndex = useMemo(() => {
    return dateMarkers.findIndex((marker) => marker.isToday);
  }, [dateMarkers]);


  return (
    <section className="mt-6 flex h-full flex-col gap-0 bg-gradient-to-b from-elevation-surface-sunken via-elevation-surface-raised to-elevation-surface-raised rounded-lg shadow-lg border border-border">
      {/* Timeline Header */}
      <div className="flex gap-0 border-b-2 border-border bg-gradient-to-r from-elevation-surface-raised to-elevation-surface-raised/95 sticky top-0 z-10 rounded-t-lg">
        {/* Issue names column header */}
        <div className="w-72 flex-shrink-0 border-r border-border-subtle px-4 py-3 bg-elevation-surface-raised">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-background-brand-bold animate-pulse" />
            <span className="text-xs font-primary-bold text-font uppercase tracking-wider">
              Issue
            </span>
            <span className="ml-auto text-xs font-primary text-font-subtle bg-background-neutral px-2 py-0.5 rounded-full">
              {allIssues.length}
            </span>
          </div>
        </div>

        {/* Timeline header with scroll indicator */}
        <div className="flex-1 relative overflow-x-auto overflow-y-hidden">
          <div
            className="flex gap-0"
            style={{ width: `${timelineWidth}px` }}
          >
            {dateMarkers.map((marker, index) => {
              const isWeekend = marker.dayOfWeek === 0 || marker.dayOfWeek === 6;
              const isToday = marker.isToday;
              return (
                <div
                  key={index}
                  className={cx(
                    "flex flex-col items-center justify-center text-xs py-3 border-r border-border-subtle font-primary-bold transition-all duration-200",
                    isToday && "bg-background-brand-subtlest ring-1 ring-border-brand ring-inset",
                    isWeekend && !isToday && "bg-background-neutral-subtler",
                    !isWeekend && !isToday && "bg-elevation-surface-raised hover:bg-elevation-surface-hovered"
                  )}
                  style={{ width: `${PIXELS_PER_DAY}px`, minWidth: `${PIXELS_PER_DAY}px` }}
                >
                  {isToday && (
                    <span className="text-[9px] font-primary-bold text-font-brand uppercase tracking-wider mb-0.5">
                      Today
                    </span>
                  )}
                  <span className={cx(
                    "transition-colors",
                    isToday && "text-font-brand font-primary-bold",
                    isWeekend && !isToday && "text-font",
                    !isWeekend && !isToday && "text-font-subtle"
                  )}>
                    {formatDateForTimeline(marker.date)}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Right edge fade effect */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-elevation-surface-raised via-elevation-surface-raised/70 to-transparent" />
        </div>
      </div>

      {/* Issues rows with gantt bars */}
      <div className="flex gap-0 flex-1 overflow-hidden">
        {/* Issue names column */}
        <div className="w-72 flex-shrink-0 border-r border-border-subtle bg-elevation-surface-raised">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-0">
              {allIssues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-background-neutral-bold/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-font-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-sm font-primary-bold text-font-subtle">No issues found</span>
                  <span className="text-xs text-font-subtlest mt-1">Add issues to see them in the timeline</span>
                </div>
              ) : (
                allIssues.map((issue, index) => (
                  <div
                    key={issue.id}
                    className={cx(
                      "text-xs font-primary text-font py-2 px-4 h-10 flex items-center gap-2 border-b border-border-subtle hover:bg-elevation-surface-hovered transition-all duration-150 cursor-pointer group",
                      index % 2 === 0 ? "bg-elevation-surface-raised" : "bg-elevation-surface-raised/80"
                    )}
                    title={issue.name}
                  >
                    <span className={cx(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      issue.categoryType === "TODO" && "bg-background-accent-grey-bolder",
                      issue.categoryType === "IN_PROGRESS" && "bg-background-accent-blue-bolder",
                      issue.categoryType === "DONE" && "bg-background-accent-green-bolder",
                      !issue.categoryType && "bg-background-brand-bold"
                    )} />
                    <span className="truncate group-hover:font-primary-bold transition-all duration-150">{issue.name}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Timeline bars with scroll indicator */}
        <div className="flex-1 relative overflow-hidden bg-elevation-surface-sunken">
          <ScrollArea className="h-full">
            <div
              className="relative"
              style={{ width: `${timelineWidth}px`, minHeight: "100%" }}
            >
              {/* Grid lines for each day */}
              {dateMarkers.map((marker, index) => {
                const isWeekend = marker.dayOfWeek === 0 || marker.dayOfWeek === 6;
                const isToday = marker.isToday;
                return (
                  <div
                    key={`grid-${index}`}
                    className={cx(
                      "absolute top-0 bottom-0 border-r transition-colors",
                      isToday && "bg-background-brand-subtlest/30 border-r-border-brand",
                      isWeekend && !isToday && "bg-background-neutral-subtler/50 border-r-border-subtle",
                      !isWeekend && !isToday && "bg-transparent border-r-border-subtle"
                    )}
                    style={{
                      left: `${index * PIXELS_PER_DAY}px`,
                      width: `${PIXELS_PER_DAY}px`,
                    }}
                  >
                    {/* Today marker line */}
                    {isToday && (
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-background-brand-bold -translate-x-1/2 opacity-60" />
                    )}
                  </div>
                );
              })}

              {/* Gantt bars for each issue */}
              {allIssues.map((issue, issueIndex) => (
                <div
                  key={`row-${issue.id}`}
                  className={cx(
                    "relative h-10 border-b border-border-subtle hover:bg-background-neutral-subtler/40 transition-all duration-150",
                    issueIndex % 2 === 0 ? "bg-transparent" : "bg-elevation-surface-sunken/50"
                  )}
                  style={{
                    minHeight: "40px",
                  }}
                >
                  <GanttBar
                    issue={issue}
                    timelineStart={timelineRange.start}
                    pixelsPerDay={PIXELS_PER_DAY}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          {/* Right edge fade effect */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-elevation-surface-sunken via-elevation-surface-sunken/70 to-transparent" />
        </div>
      </div>
    </section>
  );
};

interface Props {
  categories: Category[];
}
