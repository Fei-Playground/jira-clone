import { Issue } from "@domain/issue";

const toDateInputValue = (timestamp?: number): string => {
  if (timestamp == null) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const SelectDates = ({
  issue,
  readOnly = false,
  error,
}: Props): JSX.Element => {
  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="startDate"
          className="mb-1 block font-primary-light text-xs text-font"
        >
          Start date
        </label>
        <input
          id="startDate"
          type="date"
          name="startDate"
          defaultValue={toDateInputValue(issue?.startDate)}
          disabled={readOnly}
          className="w-full rounded border-none bg-background-input px-3 py-2 text-xs text-font outline outline-2 outline-border-input focus:outline-border-brand disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      <div>
        <label
          htmlFor="endDate"
          className="mb-1 block font-primary-light text-xs text-font"
        >
          End date
        </label>
        <input
          id="endDate"
          type="date"
          name="endDate"
          defaultValue={toDateInputValue(issue?.endDate)}
          disabled={readOnly}
          className="w-full rounded border-none bg-background-input px-3 py-2 text-xs text-font outline outline-2 outline-border-input focus:outline-border-brand disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      {error && (
        <p className="m-0 font-primary-light text-2xs text-font-danger">
          {error}
        </p>
      )}
    </div>
  );
};

interface Props {
  issue?: Issue;
  readOnly?: boolean;
  error?: string;
}
