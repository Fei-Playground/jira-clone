import { useMemo, useState } from "react";
import cx from "classix";

const toInputValue = (timestamp?: number | null): string => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const DueDateField = ({ initDueDate, readOnly }: Props): JSX.Element => {
  const [value, setValue] = useState(toInputValue(initDueDate));

  const status = useMemo(() => {
    if (!value) return "none" as const;
    const selected = new Date(value);
    selected.setHours(23, 59, 59, 999);
    const now = new Date();
    if (selected.getTime() < now.getTime()) return "overdue" as const;
    const inThreeDays = new Date();
    inThreeDays.setDate(inThreeDays.getDate() + 3);
    if (selected.getTime() <= inThreeDays.getTime()) return "soon" as const;
    return "ok" as const;
  }, [value]);

  return (
    <div>
      <label htmlFor="issue-due-date" className="mb-1 block">
        Due date
      </label>
      <div className="flex items-center gap-2">
        <input
          id="issue-due-date"
          type="date"
          name="dueDate"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={readOnly}
          aria-label="Due date"
          className={cx(
            "w-full rounded border-none bg-background-neutral px-2 py-1.5 font-primary-bold text-sm text-font",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        />
        {value && !readOnly && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="shrink-0 rounded px-2 py-1 text-xs text-font-subtlest hover:bg-background-neutral-hovered focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand"
            aria-label="Clear due date"
          >
            Clear
          </button>
        )}
      </div>
      {status === "overdue" && (
        <p className="mt-1 text-xs text-font-danger" role="status">
          Overdue
        </p>
      )}
      {status === "soon" && (
        <p className="mt-1 text-xs text-font-warning" role="status">
          Due soon
        </p>
      )}
      {status === "ok" && (
        <p className="mt-1 text-xs text-font-success" role="status">
          On track
        </p>
      )}
    </div>
  );
};

interface Props {
  initDueDate?: number | null;
  readOnly?: boolean;
}
