import { useEffect } from "react";
import { Link } from "react-router";
import cx from "classix";
import { useDrag } from "react-dnd";
import { CategoryId } from "@domain/category";
import { Issue, IssueId } from "@domain/issue";
import { PriorityId } from "@domain/priority";
import { TaskIcon } from "@app/components/icons";
import { PriorityIcon } from "@app/components/priority-icon";
import { Tooltip } from "@app/components/tooltip";
import { useSortBy } from "@app/hooks/useSortBy";
import { formatDateTime } from "@utils/formatDateTime";

export interface DropItem {
  issueId: IssueId;
  categoryId: CategoryId;
}

export const IssueCard = ({
  issue,
  categoryId,
  isSubmitting,
  handleDragging,
}: Props): JSX.Element => {
  const issueIdPrefix = issue.id.split("-")[0];
  const sortBy = useSortBy();
  const issueLink = sortBy
    ? `issue/${issue.id}?sortBy=${sortBy}`
    : `issue/${issue.id}`;

  type Collected = { isDragging: boolean };

  const [{ isDragging }, dragRef] = useDrag<DropItem, unknown, Collected>(
    () => ({
      type: DRAG_ISSUE_CARD,
      item: {
        issueId: issue.id,
        categoryId,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [issue.id]
  );

  useEffect(() => {
    handleDragging(isDragging);
  }, [isDragging, handleDragging]);

  return (
    <div
      ref={
        isSubmitting
          ? undefined
          : (dragRef as unknown as React.Ref<HTMLDivElement>)
      }
    >
      <IssueCardContent
        link={issueLink}
        name={issue.name}
        priorityId={issue.priority.id}
        idPrefix={issueIdPrefix}
        reporterName={issue.reporter.name}
        createdAt={issue.createdAt}
        isSubmitting={isSubmitting}
        showTooltip={!isDragging}
      />
    </div>
  );
};

interface Props {
  issue: Issue;
  categoryId: CategoryId;
  isSubmitting: boolean;
  handleDragging: (isDragging: boolean) => void;
}

export const IssueCardContent = ({
  link,
  name,
  priorityId,
  idPrefix,
  reporterName,
  createdAt,
  isSubmitting,
  showTooltip = true,
}: IssueCardContentProps): JSX.Element => (
  <Tooltip
    show={showTooltip}
    wrapperClassName="w-full"
    className="text-xs"
    title={
      <>
        <p>Reported by {reporterName}</p>
        <p>Created at: {formatDateTime(createdAt)}</p>
      </>
    }
  >
    <div
      style={{ minWidth: "200px" }}
      className={cx(
        "flex w-full cursor-pointer flex-col rounded border-none bg-elevation-surface-raised p-3 text-left shadow-xs duration-200 ease-in-out hover:bg-elevation-surface-raised-hovered active:bg-elevation-surface-raised-pressed",
        "outline outline-2 outline-transparent hover:outline-border-brand",
        isSubmitting && "opacity-50"
      )}
    >
      <Link to={link}>
        <>
          <p className="line-clamp-2 min-h-[48px] w-full text-font">{name}</p>
          <div className="flex items-center justify-between pt-4">
            <span className="flex items-center">
              <TaskIcon size={18} />
              <span className="ml-1.5 text-2xs text-font-subtlest">
                {idPrefix}
              </span>
            </span>
            <PriorityIcon priority={priorityId} />
          </div>
        </>
      </Link>
    </div>
  </Tooltip>
);

interface IssueCardContentProps {
  link: string;
  name: string;
  priorityId: PriorityId;
  idPrefix: string;
  reporterName: string;
  createdAt: number;
  isSubmitting: boolean;
  showTooltip?: boolean;
}

export const DRAG_ISSUE_CARD = "ISSUE_CARD";
