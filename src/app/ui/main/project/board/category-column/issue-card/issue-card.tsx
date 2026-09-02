import { useEffect } from "react";
import { Link } from "react-router";
import cx from "classix";
import { useDrag } from "react-dnd";
import * as Checkbox from "@radix-ui/react-checkbox";
import { BsCheckLg } from "react-icons/bs";
import { CategoryId } from "@domain/category";
import { Issue, IssueId } from "@domain/issue";
import { PriorityId } from "@domain/priority";
import { TaskIcon } from "@app/components/icons";
import { PriorityIcon } from "@app/components/priority-icon";
import { useSortBy } from "@app/hooks/useSortBy";
import { useProjectStore } from "@app/ui/main/project";

export interface DropItem {
  issueId: IssueId;
  categoryId: CategoryId;
}

export const IssueCard = ({
  issue,
  categoryId,
  isSubmitting,
  isSelected,
  onToggleSelect,
  handleDragging,
}: Props): JSX.Element => {
  const issueIdPrefix = issue.id.split("-")[0];
  const sortBy = useSortBy();
  const { isSelectMode } = useProjectStore();
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

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectMode) {
      e.preventDefault();
      e.stopPropagation();
      onToggleSelect(issue.id);
    }
  };

  const shouldAttachDrag = !isSelectMode && !isSubmitting;

  return (
    <div
      ref={
        shouldAttachDrag
          ? (dragRef as unknown as React.Ref<HTMLDivElement>)
          : undefined
      }
      onClick={handleCardClick}
      className={cx(
        "relative rounded",
        isSelected && "ring-2 ring-border-brand"
      )}
    >
      {isSelectMode && (
        <div className="absolute left-2 top-2 z-10">
          <Checkbox.Root
            className="flex h-5 w-5 items-center justify-center rounded border border-border-input bg-background-input shadow-sm"
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(issue.id)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select issue ${issueIdPrefix}`}
          >
            <Checkbox.Indicator className="flex h-5 w-5 items-center justify-center rounded bg-background-brand-bold">
              <BsCheckLg size={11} className="text-font-inverse" />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>
      )}
      <IssueCardContent
        link={issueLink}
        name={issue.name}
        priorityId={issue.priority.id}
        idPrefix={issueIdPrefix}
        isSubmitting={isSubmitting}
        isSelectMode={isSelectMode}
      />
    </div>
  );
};

interface Props {
  issue: Issue;
  categoryId: CategoryId;
  isSubmitting: boolean;
  isSelected: boolean;
  onToggleSelect: (issueId: IssueId) => void;
  handleDragging: (isDragging: boolean) => void;
}

export const IssueCardContent = ({
  link,
  name,
  priorityId,
  idPrefix,
  isSubmitting,
  isSelectMode,
}: IssueCardContentProps): JSX.Element => {
  const content = (
    <>
      <p className="line-clamp-2 min-h-[48px] w-full text-font">{name}</p>
      <div className="flex items-center justify-between pt-4">
        <span className="flex items-center">
          <TaskIcon size={18} />
          <span className="ml-1.5 text-2xs text-font-subtlest">{idPrefix}</span>
        </span>
        <PriorityIcon priority={priorityId} />
      </div>
    </>
  );

  return (
    <div
      style={{ minWidth: "200px" }}
      className={cx(
        "flex w-full cursor-pointer flex-col rounded border-none bg-elevation-surface-raised p-3 text-left shadow-xs duration-200 ease-in-out hover:bg-elevation-surface-raised-hovered active:bg-elevation-surface-raised-pressed",
        isSubmitting && "opacity-50"
      )}
    >
      {isSelectMode ? (
        <div className="pl-6">{content}</div>
      ) : (
        <Link to={link}>{content}</Link>
      )}
    </div>
  );
};

interface IssueCardContentProps {
  link: string;
  name: string;
  priorityId: PriorityId;
  idPrefix: string;
  isSubmitting: boolean;
  isSelectMode: boolean;
}

export const DRAG_ISSUE_CARD = "ISSUE_CARD";
