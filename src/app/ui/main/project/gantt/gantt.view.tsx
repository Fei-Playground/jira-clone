import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import cx from "classix";
import { Milestone, milestonesMock } from "@domain/milestone";
import { GanttTask, ganttTasksMock } from "@domain/gantt";
import { categoryTypeDict } from "@domain/category";
import { Button } from "@app/components/button";
import { Tooltip } from "@app/components/tooltip";
import {
  DAY_WIDTH,
  HEADER_HEIGHT,
  LABEL_WIDTH,
  MILESTONE_LANE_HEIGHT,
  ROW_HEIGHT,
  addDays,
  buildDayTicks,
  dateToOffset,
  daysBetween,
  formatDayLabel,
  formatWeekday,
  offsetToDate,
  startOfDay,
  statusBarClass,
} from "./gantt-timeline";

const DEFAULT_RANGE_START = startOfDay(
  new Date("2022-01-10T00:00:00").valueOf()
);
const DEFAULT_DAY_COUNT = 49; // 7 weeks

export const GanttView = ({
  tasks = ganttTasksMock,
  initialMilestones = milestonesMock,
}: GanttViewProps): JSX.Element => {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [draft, setDraft] = useState<MilestoneDraft | null>(null);

  const rangeStart = DEFAULT_RANGE_START;
  const dayCount = DEFAULT_DAY_COUNT;
  const rangeEnd = addDays(rangeStart, dayCount - 1);
  const timelineWidth = dayCount * DAY_WIDTH;
  const dayTicks = useMemo(
    () => buildDayTicks(rangeStart, dayCount),
    [rangeStart, dayCount]
  );

  const openDraftAt = (clientX: number, container: HTMLElement) => {
    // Header moves with the scroll container; rect already reflects scroll position.
    const rect = container.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const date = offsetToDate(offsetX, rangeStart);
    if (date < rangeStart || date > rangeEnd) return;

    setDraft({
      date,
      name: "New milestone",
      left: dateToOffset(date, rangeStart) + DAY_WIDTH / 2,
    });
  };

  const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore clicks that originate from the draft popover
    if ((e.target as HTMLElement).closest("[data-milestone-draft]")) return;
    openDraftAt(e.clientX, e.currentTarget);
  };

  const cancelDraft = () => setDraft(null);

  const saveDraft = () => {
    if (!draft) return;
    const name = draft.name.trim() || "New milestone";
    setMilestones((prev) => [
      ...prev,
      {
        id: `temp-ms-${uuid()}`,
        name,
        date: startOfDay(draft.date),
      },
    ]);
    setDraft(null);
  };

  const removeMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="mb-4 font-primary-light text-sm text-font-subtlest">
        Click the timeline header to add a milestone. Diamonds sit above the
        task rows and mark key deliverables.
      </p>

      <div className="min-h-0 flex-1 overflow-auto rounded border border-border bg-elevation-surface">
        <div
          className="relative inline-flex min-w-full flex-col"
          style={{ minWidth: LABEL_WIDTH + timelineWidth }}
        >
          {/* Header row */}
          <div className="sticky top-0 z-20 flex border-b border-border bg-elevation-surface-raised">
            <div
              className="sticky left-0 z-30 flex shrink-0 items-end border-r border-border bg-elevation-surface-raised px-3 pb-2 font-primary-bold text-xs text-font-subtlest"
              style={{ width: LABEL_WIDTH, height: HEADER_HEIGHT }}
            >
              Tasks
            </div>
            <div
              role="button"
              tabIndex={0}
              aria-label="Timeline header — click to add a milestone"
              className="relative cursor-copy select-none"
              style={{ width: timelineWidth, height: HEADER_HEIGHT }}
              onClick={handleHeaderClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  openDraftAt(rect.left + DAY_WIDTH * 3, e.currentTarget);
                }
              }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-1 flex justify-center">
                <span className="rounded bg-background-neutral px-2 py-0.5 font-primary-light text-2xs text-font-subtlest">
                  Click a date to add a milestone
                </span>
              </div>
              <div className="flex h-full items-end">
                {dayTicks.map((day) => {
                  const isMonday = new Date(day).getDay() === 1;
                  return (
                    <div
                      key={day}
                      className={cx(
                        "flex shrink-0 flex-col items-center justify-end border-r border-border pb-1.5",
                        isMonday && "bg-background-neutral/40"
                      )}
                      style={{ width: DAY_WIDTH }}
                    >
                      <span className="font-primary-light text-2xs text-font-subtlest">
                        {formatWeekday(day)}
                      </span>
                      <span className="font-primary-bold text-2xs text-font">
                        {formatDayLabel(day)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {draft && (
                <div
                  data-milestone-draft
                  className="absolute z-40 w-[220px] -translate-x-1/2 rounded border border-border-brand bg-elevation-surface-overlay p-3 shadow-lg"
                  style={{ left: draft.left, top: HEADER_HEIGHT - 4 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="mb-1 font-primary-bold text-xs text-font">
                    New milestone
                  </p>
                  <p className="mb-2 font-primary-light text-2xs text-font-subtlest">
                    {formatDayLabel(draft.date)}
                  </p>
                  <input
                    autoFocus
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveDraft();
                      if (e.key === "Escape") cancelDraft();
                    }}
                    className="mb-2 w-full rounded border border-border-input bg-background-input px-2 py-1.5 font-primary-light text-sm text-font outline-none focus:border-border-brand"
                    aria-label="Milestone name"
                    placeholder="Milestone name"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="px-3 py-1.5 text-xs"
                      onClick={saveDraft}
                      aria-label="Save milestone"
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      color="neutral"
                      variant="text"
                      className="px-3 py-1.5 text-xs"
                      onClick={cancelDraft}
                      aria-label="Cancel milestone"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Milestone lane — above task rows */}
          <div className="flex border-b border-border bg-elevation-surface-sunken">
            <div
              className="sticky left-0 z-10 flex shrink-0 items-center border-r border-border bg-elevation-surface-sunken px-3 font-primary-bold text-xs text-font-subtlest"
              style={{ width: LABEL_WIDTH, height: MILESTONE_LANE_HEIGHT }}
            >
              Milestones
            </div>
            <div
              className="relative"
              style={{ width: timelineWidth, height: MILESTONE_LANE_HEIGHT }}
              aria-label="Milestone markers"
            >
              {/* vertical grid lines */}
              {dayTicks.map((day) => (
                <div
                  key={`ms-grid-${day}`}
                  className="border-border/60 absolute top-0 h-full border-r"
                  style={{
                    left: dateToOffset(day, rangeStart),
                    width: DAY_WIDTH,
                  }}
                />
              ))}
              {milestones.map((milestone) => {
                const left =
                  dateToOffset(milestone.date, rangeStart) + DAY_WIDTH / 2;
                if (
                  milestone.date < rangeStart ||
                  milestone.date > addDays(rangeStart, dayCount)
                ) {
                  return null;
                }
                return (
                  <MilestoneMarker
                    key={milestone.id}
                    milestone={milestone}
                    left={left}
                    onRemove={() => removeMilestone(milestone.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Task rows */}
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              rangeStart={rangeStart}
              dayTicks={dayTicks}
              timelineWidth={timelineWidth}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface GanttViewProps {
  tasks?: GanttTask[];
  initialMilestones?: Milestone[];
}

interface MilestoneDraft {
  date: number;
  name: string;
  left: number;
}

const MilestoneMarker = ({
  milestone,
  left,
  onRemove,
}: {
  milestone: Milestone;
  left: number;
  onRemove: () => void;
}): JSX.Element => {
  return (
    <div
      className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left }}
    >
      <Tooltip title={`${milestone.name} · ${formatDayLabel(milestone.date)}`}>
        <button
          type="button"
          className="group relative flex h-10 w-10 flex-col items-center justify-center border-none bg-transparent"
          aria-label={`Milestone: ${milestone.name}. Double-click to remove.`}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <span
            className="block h-[14px] w-[14px] rotate-45 rounded-[2px] border-2 border-border-brand bg-background-brand-bold shadow-sm transition-transform group-hover:scale-110"
            aria-hidden
          />
          <span className="pointer-events-none mt-1 max-w-[64px] truncate text-center font-primary-bold text-[10px] leading-none text-font-brand">
            {milestone.name}
          </span>
        </button>
      </Tooltip>
    </div>
  );
};

const TaskRow = ({
  task,
  rangeStart,
  dayTicks,
  timelineWidth,
}: {
  task: GanttTask;
  rangeStart: number;
  dayTicks: number[];
  timelineWidth: number;
}): JSX.Element => {
  const start = startOfDay(task.startDate);
  const end = startOfDay(task.endDate);
  const left = dateToOffset(start, rangeStart);
  const width = Math.max(DAY_WIDTH, (daysBetween(start, end) + 1) * DAY_WIDTH);
  const barClass =
    statusBarClass[task.status] ??
    "bg-background-neutral-bold text-font-inverse";

  return (
    <div className="flex border-b border-border last:border-b-0">
      <div
        className="sticky left-0 z-10 flex shrink-0 items-center border-r border-border bg-elevation-surface px-3"
        style={{ width: LABEL_WIDTH, height: ROW_HEIGHT }}
      >
        <div className="min-w-0">
          <p
            className="truncate font-primary text-sm text-font"
            title={task.name}
          >
            {task.name}
          </p>
          <p className="font-primary-light text-2xs text-font-subtlest">
            {categoryTypeDict[task.status]}
          </p>
        </div>
      </div>
      <div
        className="relative"
        style={{ width: timelineWidth, height: ROW_HEIGHT }}
      >
        {dayTicks.map((day) => (
          <div
            key={`task-grid-${task.id}-${day}`}
            className="border-border/40 absolute top-0 h-full border-r"
            style={{ left: dateToOffset(day, rangeStart), width: DAY_WIDTH }}
          />
        ))}
        <div
          className={cx(
            "absolute top-1/2 flex h-7 -translate-y-1/2 items-center overflow-hidden rounded px-2 font-primary-bold text-2xs shadow-sm",
            barClass
          )}
          style={{ left, width }}
          title={`${task.name}: ${formatDayLabel(start)} – ${formatDayLabel(end)}`}
        >
          <span className="truncate">{task.name}</span>
        </div>
      </div>
    </div>
  );
};
