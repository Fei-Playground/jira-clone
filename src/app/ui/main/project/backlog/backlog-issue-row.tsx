import { useFetcher } from "react-router";
import cx from "classix";
import { Issue } from "@domain/issue";
import { Sprint } from "@domain/sprint";
import { IssueCardContent } from "@app/ui/main/project/board/category-column/issue-card";
import { BACKLOG_VALUE, SelectSprint } from "./select-sprint";

export const BacklogIssueRow = ({ issue, sprints }: Props): JSX.Element => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  // The issue panel lives on the board, so this opens it there
  const issueLink = `../board/issue/${issue.id}`;

  const handleValueChange = (sprintId: string): void => {
    fetcher.submit(
      {
        _action: "updateIssueSprint",
        issueId: issue.id,
        sprintId: sprintId === BACKLOG_VALUE ? "" : sprintId,
      },
      {
        method: "post",
      }
    );
  };

  return (
    <div
      className={cx(
        // `relative` keeps the select's hidden input inside the row instead of
        // stretching the page below the app shell
        "relative flex items-center gap-3",
        isSubmitting && "opacity-50"
      )}
    >
      <div className="flex-grow">
        <IssueCardContent
          link={issueLink}
          name={issue.name}
          priorityId={issue.priority.id}
          idPrefix={issue.id.split("-")[0]}
          isSubmitting={isSubmitting}
        />
      </div>
      <SelectSprint
        value={issue.sprintId || BACKLOG_VALUE}
        sprints={sprints}
        disabled={isSubmitting}
        onValueChange={handleValueChange}
      />
    </div>
  );
};

interface Props {
  issue: Issue;
  sprints: Sprint[];
}
