import { useState, useRef } from "react";
import { formatDateTime } from "@utils/formatDateTime";
import { HiCalendar, HiX } from "react-icons/hi";
import { Button } from "@app/components/button";

export const SelectDueDate = ({ initDueDate }: Props): JSX.Element => {
  const [dueDate, setDueDate] = useState<number | undefined>(initDueDate);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setDueDate(new Date(e.target.value).valueOf());
    } else {
      setDueDate(undefined);
    }
  };

  const handleClearDate = () => {
    setDueDate(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const dateValue = dueDate
    ? new Date(dueDate).toISOString().split("T")[0]
    : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-md border border-border-brand bg-background-neutral py-2 px-3">
        <HiCalendar className="w-4 h-4 text-icon-subtle" />
        <input
          ref={inputRef}
          type="date"
          name="dueDate"
          value={dateValue}
          onChange={handleDateChange}
          className="flex-1 bg-transparent text-sm outline-none"
        />
        {dueDate && (
          <button
            type="button"
            onClick={handleClearDate}
            className="p-1 hover:bg-background-neutral-hovered rounded"
            aria-label="Clear due date"
          >
            <HiX className="w-4 h-4 text-icon-subtle" />
          </button>
        )}
      </div>
      {dueDate && (
        <p className="text-2xs text-font-subtle">
          Due on {formatDateTime(dueDate)}
        </p>
      )}
    </div>
  );
};

interface Props {
  initDueDate?: number;
}
