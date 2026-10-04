import { useEffect } from "react";
import { Link } from "react-router";
import cx from "classix";
import { useDrag } from "react-dnd";
import { CategoryId, CategoryType } from "@domain/category/category";
import {
  Issue,
  IssueId,
  AgingLevel,
  getIssueAgingLevel,
  getIssueAgeInDays,
} from "@domain/issue/issue";
import { PriorityId } from "@domain/priority/priority";
import { TaskIcon } from "@app/components/icons";
import { PriorityIcon } from "@app/components/priority-icon/priority-icon";
import { AgingIndicator } from "@app/components/aging-indicator/aging-indicator";
import { useSortBy } from "@app/hooks/useSortBy";

export interface DropItem {
  issueId: IssueId;
  categoryId: CategoryId;
}

export const IssueCard = ({
  issue,
  categoryId,
  categoryType,
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
        agingLevel={getIssueAgingLevel({
          ...issue,
          categoryType: categoryType || issue.categoryType,
        })}
        ageInDays={getIssueAgeInDays(issue.createdAt)}
      />
    </div>
  );
};

interface Props {
  issue: Issue;
  categoryId: CategoryId;
  categoryType?: CategoryType;
  isSubmitting: boolean;
  handleDragging: (isDragging: boolean) => void;
}

export const IssueCardContent = ({
  link,
  name,
  priorityId,
  idPrefix,
  isSubmitting,
  agingLevel = "fresh",
  ageInDays = 0,
}: IssueCardContentProps): JSX.Element => (
  <div
    style={{ minWidth: "200px" }}
    className={cx(
      "flex w-full cursor-pointer flex-col rounded border-none bg-elevation-surface-raised p-3 text-left shadow-xs duration-200 ease-in-out hover:bg-elevation-surface-raised-hovered active:bg-elevation-surface-raised-pressed",
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
          <span className="flex items-center gap-2">
            <AgingIndicator level={agingLevel} ageInDays={ageInDays} />
            <PriorityIcon priority={priorityId} />
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
  agingLevel?: AgingLevel;
  ageInDays?: number;
}

export const DRAG_ISSUE_CARD = "ISSUE_CARD";
