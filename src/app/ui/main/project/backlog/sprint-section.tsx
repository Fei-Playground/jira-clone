import { RxValueNone } from "react-icons/rx";
import cx from "classix";
import {
  SprintStatus,
  SprintWithIssues,
  getSprintStatus,
  sprintStatusDict,
} from "@domain/sprint";
import { formatDate } from "@utils/date";
import { BacklogIssueRow } from "./backlog-issue-row";
import { DeleteSprintDialog } from "./delete-sprint-dialog";

/** Only the sprint that is running carries the brand tint; the others stay neutral. */
const getStatusClass = (status: SprintStatus): string =>
  status === "CURRENT"
    ? "bg-background-brand-subtlest text-font-brand"
    : "bg-background-neutral text-font-subtle";

const metadataClass = "font-primary-light text-2xs text-font-subtle";

export const SprintSection = ({ sprint, sprints }: Props): JSX.Element => {
  const status = getSprintStatus(sprint);

  return (
    <section className="rounded-md bg-elevation-surface-sunken p-3">
      <header className="flex items-center justify-between gap-3 px-1 pb-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-primary-bold text-lg text-font">
            {sprint.name}
          </h2>
          <span
            className={cx(
              "rounded px-1.5 py-0.5 font-primary-light text-2xs",
              getStatusClass(status)
            )}
          >
            {sprintStatusDict[status]}
          </span>
          <span className={metadataClass}>
            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
          </span>
          {sprint.issues.length > 0 && (
            <span className={metadataClass}>( {sprint.issues.length} )</span>
          )}
        </div>
        <DeleteSprintDialog sprint={sprint} />
      </header>
      {sprint.issues.length === 0 ? (
        <EmptySprint status={status} />
      ) : (
        <ul className="space-y-2">
          {sprint.issues.map((issue) => (
            <li key={issue.id}>
              <BacklogIssueRow issue={issue} sprints={sprints} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

interface Props {
  sprint: SprintWithIssues;
  sprints: SprintWithIssues[];
}

const EmptySprint = ({ status }: EmptySprintProps): JSX.Element => (
  <p className="flex items-center gap-3 px-1 py-4 font-primary-light text-xs uppercase text-font-subtlest">
    <RxValueNone size={24} />
    {status === "COMPLETED"
      ? "No issues were planned in this sprint"
      : "Nothing planned yet"}
  </p>
);

interface EmptySprintProps {
  status: SprintStatus;
}
