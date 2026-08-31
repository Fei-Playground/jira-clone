import { useState } from "react";
import cx from "classix";

export const EstimateField = ({
  initEstimate,
  initTimeLogged,
  readOnly,
}: Props): JSX.Element => {
  const [estimate, setEstimate] = useState(initEstimate || "");
  const [timeLogged, setTimeLogged] = useState(initTimeLogged || "");

  const inputClass = cx(
    "w-full rounded border-none bg-background-neutral px-2 py-1.5 font-primary-bold text-sm text-font",
    "placeholder:font-primary-light placeholder:text-font-subtlest",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand",
    "disabled:cursor-not-allowed disabled:opacity-60"
  );

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="issue-estimate" className="mb-1 block">
          Estimate
        </label>
        <input
          id="issue-estimate"
          type="text"
          name="estimate"
          value={estimate}
          onChange={(e) => setEstimate(e.target.value)}
          disabled={readOnly}
          placeholder="e.g. 2h, 1d"
          aria-label="Time estimate"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="issue-time-logged" className="mb-1 block">
          Time logged
        </label>
        <input
          id="issue-time-logged"
          type="text"
          name="timeLogged"
          value={timeLogged}
          onChange={(e) => setTimeLogged(e.target.value)}
          disabled={readOnly}
          placeholder="e.g. 45m"
          aria-label="Time logged"
          className={inputClass}
        />
      </div>
    </div>
  );
};

interface Props {
  initEstimate?: string | null;
  initTimeLogged?: string | null;
  readOnly?: boolean;
}
