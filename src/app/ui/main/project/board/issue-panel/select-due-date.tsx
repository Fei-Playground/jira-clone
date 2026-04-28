import { useState, useRef, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { cx } from "classix";
import { Button } from "@app/components/button";

const formatDate = (timestamp?: number): string => {
  if (!timestamp) return "No due date";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const dateToInputFormat = (timestamp?: number): string => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const SelectDueDate = ({ initDueDate }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    dateToInputFormat(initDueDate)
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate("");
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const displayValue = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No due date";

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          className={cx(
            "flex h-10 w-full items-center gap-3 rounded-md border-2 border-transparent",
            "px-3 py-2 text-left font-primary text-font transition-colors",
            "hover:bg-background-neutral-hovered",
            "focus-visible:outline-2 focus-visible:outline-border-brand",
            "aria-label='Open due date picker'"
          )}
          aria-label="Open due date picker"
        >
          <span className="flex-1 truncate text-font">{displayValue}</span>
          <span className="text-xl">📅</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 rounded-md border border-border-neutral bg-elevation-surface-raised p-4 shadow-md"
          sideOffset={8}
        >
          <div className="flex flex-col gap-3">
            <input
              ref={inputRef}
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className={cx(
                "rounded-md border border-border-neutral px-3 py-2",
                "font-primary text-font",
                "focus-visible:outline-2 focus-visible:outline-border-brand"
              )}
            />
            <div className="flex gap-2">
              {selectedDate && (
                <Button
                  size="sm"
                  variant="neutral"
                  onClick={handleClear}
                  className="flex-1"
                  aria-label="Clear due date"
                >
                  Clear
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleConfirm}
                className="flex-1"
                aria-label="Confirm due date"
              >
                Done
              </Button>
            </div>
          </div>
          <Popover.Arrow className="fill-elevation-surface-raised" />
        </Popover.Content>
      </Popover.Portal>

      {/* Hidden input to submit with form */}
      <input type="hidden" name="dueDate" value={selectedDate} />
    </Popover.Root>
  );
};

interface Props {
  initDueDate?: number;
}
