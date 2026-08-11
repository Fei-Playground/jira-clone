import { useEffect } from "react";
import { Link } from "react-router";
import cx from "classix";
import { useDrag } from "react-dnd";
import { CategoryId } from "@domain/category";
import { Issue, IssueId } from "@domain/issue";
import { PriorityId } from "@domain/priority";
import { TaskIcon } from "@app/components/icons";
import { PriorityIcon } from "@app/components/priority-icon";
import { useSortBy } from "@app/hooks/useSortBy";

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
        isSubmitting={isSubmitting}
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

const priorityBorderClass: Record<PriorityId, string> = {
  low: "border-l-border-success",
  medium: "border-l-border-warning",
  high: "border-l-border-danger",
};

const priorityBadgeClass: Record<PriorityId, string> = {
  // Bold fills + inverse text stay readable in both light and dark mode
  // (subtle danger/warning/success backgrounds collapse into the card surface in dark).
  low: "bg-background-success-bold text-font-inverse",
  medium: "bg-background-warning-bold text-font-inverse",
  high: "bg-background-danger-bold text-font-inverse",
};

const priorityLabel: Record<PriorityId, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
};

export const IssueCardContent = ({
  link,
  name,
  priorityId,
  idPrefix,
  isSubmitting,
}: IssueCardContentProps): JSX.Element => (
  <div
    className={cx(
      "flex w-full cursor-pointer flex-col rounded border-l-[3px] border-solid border-y-transparent border-r-transparent bg-elevation-surface-raised p-3 text-left shadow-xs duration-200 ease-in-out hover:bg-elevation-surface-raised-hovered active:bg-elevation-surface-raised-pressed",
      priorityBorderClass[priorityId],
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
          <span
            className={cx(
              // Force PriorityIcon accent colors to inherit inverse text on the bold fill
              "flex items-center gap-1 rounded-full py-0.5 pl-1 pr-1.5 [&>span]:!text-current",
              priorityBadgeClass[priorityId]
            )}
            aria-label={`Priority: ${priorityId}`}
          >
            <PriorityIcon priority={priorityId} size={14} />
            <span className="font-primary-bold text-2xs leading-none">
              {priorityLabel[priorityId]}
            </span>
          </span>
        </div>
      </>
    </Link>
  </div>
);

interface IssueCardContentProps {
  link: string;
  name: string;
  priorityId: PriorityId;
  idPrefix: string;
  isSubmitting: boolean;
}

export const DRAG_ISSUE_CARD = "ISSUE_CARD";
