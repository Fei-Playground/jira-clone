import { Link } from "react-router";
import cx from "classix";
import { Issue } from "@domain/issue";
import { ProjectId } from "@domain/project";
import { categoryTypeDict } from "@domain/category";
import { TaskIcon } from "@app/components/icons";
import { PriorityIcon } from "@app/components/priority-icon";
import { UserAvatar } from "@app/components/user-avatar";

export const IssueRow = ({ issue, projectId }: Props): JSX.Element => {
  const issueIdPrefix = issue.id.split("-")[0];
  const categoryName = issue.categoryType
    ? categoryTypeDict[issue.categoryType]
    : null;

  return (
    <Link
      to={`/projects/${projectId}/board/issue/${issue.id}`}
      className={cx(
        "flex w-full items-center gap-4 rounded border-none bg-elevation-surface-raised p-3 text-left shadow-xs duration-200 ease-in-out",
        "hover:bg-elevation-surface-raised-hovered active:bg-elevation-surface-raised-pressed"
      )}
    >
      <PriorityIcon priority={issue.priority.id} />
      <span className="min-w-0 flex-grow truncate text-font">{issue.name}</span>
      {categoryName && (
        <span className="whitespace-nowrap rounded bg-background-neutral px-2 py-1 text-2xs uppercase text-font-subtlest">
          {categoryName}
        </span>
      )}
      <span className="flex items-center">
        <TaskIcon size={18} />
        <span className="ml-1.5 text-2xs text-font-subtlest">
          {issueIdPrefix}
        </span>
      </span>
      <UserAvatar {...issue.asignee} size={24} tooltip />
    </Link>
  );
};

interface Props {
  issue: Issue;
  projectId: ProjectId;
}
