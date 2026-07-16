import { useState, useCallback, useEffect } from "react";
import { Link, Outlet, useNavigate, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import cx from "classix";
import { AiOutlinePlus } from "react-icons/ai";
import { RxValueNone } from "react-icons/rx";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { HiChatAlt2 } from "react-icons/hi";
import { useDrop, useDrag } from "react-dnd";
import { useFetcher } from "react-router";
import { Project } from "@domain/project";
import { Category, CategoryType } from "@domain/category";
import { Issue, IssueId } from "@domain/issue";
import { CategoryId } from "@domain/category";
import { PriorityIcon } from "@app/components/priority-icon";
import { UserAvatar } from "@app/components/user-avatar";
import { TaskIcon } from "@app/components/icons";
import { UserAvatarList } from "@app/ui/main/project/board/avatar-list";
import { Kbd } from "@app/components/kbd-placeholder";
import { ScrollArea } from "@app/components/scroll-area";
import { ProjectContextProvider, useProjectStore } from "@app/ui/main/project";
import { useSortBy } from "@app/hooks/useSortBy";
import { EVENTS } from "@app/events";

const DRAG_KANBAN_CARD = "KANBAN_CARD";

interface DropItem {
  issueId: IssueId;
  categoryId: CategoryId;
}

// ─── Column accent colours ────────────────────────────────────────────────────
const categoryAccent: Record<CategoryType, { dot: string; header: string; badge: string; badgeText: string }> = {
  TODO: {
    dot: "bg-background-accent-grey-bolder",
    header: "text-font-accent-grey",
    badge: "bg-background-accent-grey-subtler text-font-accent-grey",
    badgeText: "To Do",
  },
  IN_PROGRESS: {
    dot: "bg-background-accent-blue-bolder",
    header: "text-font-accent-blue",
    badge: "bg-background-accent-blue-subtler text-font-accent-blue",
    badgeText: "In Progress",
  },
  DONE: {
    dot: "bg-background-accent-green-bolder",
    header: "text-font-accent-green",
    badge: "bg-background-accent-green-subtler text-font-accent-green",
    badgeText: "Done",
  },
};

// ─── Kanban View ─────────────────────────────────────────────────────────────
export const KanbanView = ({ project }: Props): JSX.Element => {
  return (
    <ProjectContextProvider project={project}>
      <div className="box-border flex h-full flex-col">
        {/* Toolbar */}
        <section className="flex items-center gap-3">
          <KanbanSearch />
          <div className="mx-1 inline">
            <UserAvatarList users={project.users} />
          </div>
        </section>
        <DndProvider backend={HTML5Backend}>
          <KanbanBoard categories={project.categories} />
        </DndProvider>
        <Outlet />
      </div>
    </ProjectContextProvider>
  );
};

interface Props {
  project: Project;
}

// ─── Search ──────────────────────────────────────────────────────────────────
const KanbanSearch = (): JSX.Element => {
  const { search, setSearch } = useProjectStore();

  return (
    <div className="relative w-fit">
      <input
        type="text"
        value={search}
        placeholder="Filter issues"
        onChange={(e) => setSearch(e.target.value)}
        className={cx(
          "h-[40px] w-[120px] rounded border-none bg-background-input py-2 hover:bg-background-input-hovered",
          "border-1 box-border pl-2 pr-8 outline outline-2 outline-border-input duration-200 ease-in-out",
          "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
          "placeholder:duration-200 placeholder:ease-in-out focus:w-[190px]",
          "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand"
        )}
      />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 px-2">
        {search.length === 0 ? (
          <span className="flex items-center justify-center border-none">
            <BiSearch size={16} />
          </span>
        ) : (
          <button
            onMouseDown={() => setSearch("")}
            className="flex cursor-pointer items-center justify-center rounded border-none hover:bg-background-neutral"
            aria-label="Clear search"
          >
            <IoCloseOutline size={16} />
          </button>
        )}
      </span>
    </div>
  );
};

// ─── Board ───────────────────────────────────────────────────────────────────
const KanbanBoard = ({ categories }: { categories: Category[] }): JSX.Element => {
  const [isDragging, setIsDragging] = useState(false);
  const [submittingIssues, setSubmittingIssues] = useState<IssueId[]>([]);
  const [prevCategories, setPrevCategories] = useState(categories);
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

  if (categories !== prevCategories) {
    setPrevCategories(categories);
    setSubmittingIssues([]);
  }

  useEventSource("board/issue/issue-event", { event: EVENTS.ISSUE_CREATED });
  const dataUpdated = useEventSource("board/issue/issue-event", {
    event: EVENTS.ISSUE_CHANGED,
  });

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        navigate("issue/new");
      }
    },
    [navigate]
  );

  useEffect(() => {
    revalidate();
  }, [dataUpdated, revalidate]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <section className="mt-10 flex h-full flex-col">
      <span className="mb-3 block font-primary-light text-2xs text-font-subtlest">
        Press <Kbd>Shift</Kbd> + <Kbd>N</Kbd> to create a new issue
      </span>
      <div className="flex h-full gap-4">
        {categories.map((category) => (
          <KanbanColumn
            key={category.id}
            category={category}
            isDragging={isDragging}
            submittingIssues={submittingIssues}
            setSubmittingIssues={setSubmittingIssues}
            handleDragging={setIsDragging}
          />
        ))}
      </div>
    </section>
  );
};

// ─── Column ───────────────────────────────────────────────────────────────────
interface KanbanColumnProps {
  category: Category;
  isDragging: boolean;
  submittingIssues: IssueId[];
  setSubmittingIssues: React.Dispatch<React.SetStateAction<IssueId[]>>;
  handleDragging: (v: boolean) => void;
}

const KanbanColumn = ({
  category,
  isDragging,
  submittingIssues,
  setSubmittingIssues,
  handleDragging,
}: KanbanColumnProps): JSX.Element => {
  const fetcher = useFetcher();
  const sortBy = useSortBy();
  const { search } = useProjectStore();
  const accent = categoryAccent[category.type];
  const issueLink = sortBy
    ? `issue/new?category=${category.type}&sortBy=${sortBy}`
    : `issue/new?category=${category.type}`;

  const updateIssueOnCardDrop = (item: DropItem) => {
    if (item.categoryId === category.id) return;
    fetcher.submit(
      {
        _action: "updateIssueCategory",
        issueId: item.issueId,
        categoryId: category.id,
      },
      { method: "post" }
    );
    if (!submittingIssues.includes(item.issueId)) {
      setSubmittingIssues((prev) => [...prev, item.issueId]);
    }
  };

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: DRAG_KANBAN_CARD,
      drop: (item: DropItem) => updateIssueOnCardDrop(item),
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }),
    [category.id]
  );

  useEffect(() => {
    if (fetcher.data && (fetcher.data as { issueId?: IssueId }).issueId) {
      const { issueId } = fetcher.data as { issueId: IssueId };
      setSubmittingIssues((prev) => prev.filter((id) => id !== issueId));
    }
  }, [fetcher, setSubmittingIssues]);

  const filteredIssues = category.issues.filter((issue) =>
    issue.name.toLowerCase().includes(search)
  );

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className="relative flex h-full min-w-[280px] max-w-[280px] flex-col rounded-lg bg-elevation-surface-sunken"
    >
      {/* Drop overlay */}
      <div
        className={cx(
          "pointer-events-none absolute inset-0 z-50 box-border rounded-lg p-1.5 duration-200",
          isDragging ? "visible" : "hidden"
        )}
      >
        <div
          className={cx(
            "relative h-full w-full rounded-lg border-[3px]",
            isDragging ? "visible" : "hidden",
            isOver
              ? "border-solid border-border-success"
              : "flex items-center justify-center border-dashed border-border-brand"
          )}
        >
          {!isOver && (
            <span className="rounded bg-elevation-surface px-1 text-2xs font-primary-bold uppercase text-font-subtlest">
              DROP HERE
            </span>
          )}
        </div>
      </div>

      {/* Column header */}
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg bg-elevation-surface-sunken px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className={cx("h-2.5 w-2.5 rounded-full", accent.dot)} />
          <span
            className={cx(
              "font-primary-bold text-xs uppercase tracking-wider",
              accent.header
            )}
          >
            {category.name}
          </span>
          {filteredIssues.length > 0 && (
            <span className={cx("rounded px-1.5 py-0.5 text-2xs", accent.badge)}>
              {filteredIssues.length}
            </span>
          )}
        </div>
        <Link
          to={issueLink}
          className="flex items-center justify-center rounded p-0.5 text-font-subtlest hover:bg-background-neutral hover:text-font duration-200"
          aria-label={`Add new ${category.name} issue`}
        >
          <AiOutlinePlus size={18} />
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3 h-px bg-border opacity-50" />

      {/* Issues */}
      <div className="h-full min-h-0">
        <ScrollArea>
          <ul className="flex flex-col gap-2 px-3 pb-4">
            {filteredIssues.length === 0 ? (
              <EmptyColumn />
            ) : (
              filteredIssues.map((issue) => (
                <li key={issue.id}>
                  <KanbanCard
                    issue={issue}
                    categoryId={category.id}
                    isSubmitting={submittingIssues.includes(issue.id)}
                    handleDragging={handleDragging}
                  />
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface KanbanCardProps {
  issue: Issue;
  categoryId: CategoryId;
  isSubmitting: boolean;
  handleDragging: (v: boolean) => void;
}

const KanbanCard = ({
  issue,
  categoryId,
  isSubmitting,
  handleDragging,
}: KanbanCardProps): JSX.Element => {
  const sortBy = useSortBy();
  const issuePrefix = issue.id.split("-")[0];
  const issueLink = sortBy
    ? `issue/${issue.id}?sortBy=${sortBy}`
    : `issue/${issue.id}`;
  const accent = categoryAccent[issue.categoryType ?? "TODO"];

  type Collected = { isDragging: boolean };
  const [{ isDragging }, dragRef] = useDrag<DropItem, unknown, Collected>(
    () => ({
      type: DRAG_KANBAN_CARD,
      item: { issueId: issue.id, categoryId },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [issue.id]
  );

  useEffect(() => {
    handleDragging(isDragging);
  }, [isDragging, handleDragging]);

  return (
    <div
      ref={isSubmitting ? undefined : (dragRef as unknown as React.Ref<HTMLDivElement>)}
      className={cx(
        "group relative flex flex-col gap-3 rounded-lg border-none bg-elevation-surface-raised p-3 shadow-xs",
        "cursor-pointer duration-200 ease-in-out",
        "hover:-translate-y-0.5 hover:shadow-md hover:outline hover:outline-2 hover:outline-border-brand",
        isSubmitting && "opacity-50"
      )}
    >
      {/* Status badge */}
      <span
        className={cx(
          "w-fit rounded px-1.5 py-0.5 text-2xs uppercase leading-none",
          accent.badge
        )}
      >
        {accent.badgeText}
      </span>

      {/* Issue title */}
      <Link to={issueLink} className="block">
        <p className="line-clamp-2 font-primary-bold text-sm text-font leading-snug hover:text-font-brand transition-colors duration-100">
          {issue.name}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Left: ID + priority + comments */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <TaskIcon size={14} />
            <span className="font-primary-light text-2xs text-font-subtlest">
              {issuePrefix}
            </span>
          </span>
          <PriorityIcon priority={issue.priority.id} size={14} />
          {issue.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-font-subtlest">
              <HiChatAlt2 size={13} />
              <span className="font-primary-light text-2xs">
                {issue.comments.length}
              </span>
            </span>
          )}
        </div>

        {/* Right: assignee avatar */}
        <UserAvatar
          name={issue.asignee.name}
          image={issue.asignee.image}
          color={issue.asignee.color}
          size={24}
          tooltip
        />
      </div>
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyColumn = (): JSX.Element => (
  <li className="mt-6 flex flex-col items-center text-font-subtlest">
    <RxValueNone size={32} />
    <p className="mt-3 font-primary-light text-xs uppercase">No issues</p>
  </li>
);
