import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import cx from "classix";
import { BsKanban, BsBarChartSteps } from "react-icons/bs";
import { Project } from "@domain/project";
import { Category } from "@domain/category";
import { IssueId } from "@domain/issue";
import { Search } from "@app/ui/main/project/board/search";
import { Kbd } from "@app/components/kbd-placeholder";
import { UserAvatarList } from "./avatar-list";
import { SelectSort } from "./select-sort";
import { CategoryColumn } from "./category-column";
import { GanttView } from "./gantt-view";
import { ProjectContextProvider } from "../project.store";
import { EVENTS } from "@app/events";

type BoardMode = "kanban" | "gantt";

export const BoardView = ({ project }: Props): JSX.Element => {
  const [mode, setMode] = useState<BoardMode>("kanban");

  return (
    <ProjectContextProvider project={project}>
      <div className="box-border flex h-full flex-col">
        <section className="flex items-center">
          <Search />
          <div className="mx-4 my-0 inline">
            <UserAvatarList users={project.users} />
          </div>
          <div className="inline">
            <SelectSort />
          </div>
          <div className="ml-auto">
            <BoardModeToggle mode={mode} setMode={setMode} />
          </div>
        </section>
        {mode === "kanban" ? (
          <DndProvider backend={HTML5Backend}>
            <Categories categories={project.categories} />
          </DndProvider>
        ) : (
          <GanttView categories={project.categories} />
        )}
        <Outlet />
      </div>
    </ProjectContextProvider>
  );
};

const BoardModeToggle = ({
  mode,
  setMode,
}: BoardModeToggleProps): JSX.Element => (
  <div
    role="tablist"
    aria-label="Board view mode"
    className="flex items-center gap-1 rounded bg-background-neutral p-1"
  >
    <ModeButton
      isActive={mode === "kanban"}
      label="Kanban"
      onClick={() => setMode("kanban")}
      Icon={BsKanban}
    />
    <ModeButton
      isActive={mode === "gantt"}
      label="Gantt"
      onClick={() => setMode("gantt")}
      Icon={BsBarChartSteps}
    />
  </div>
);

const ModeButton = ({
  isActive,
  label,
  onClick,
  Icon,
}: ModeButtonProps): JSX.Element => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    aria-label={`Switch to ${label} view`}
    onClick={onClick}
    className={cx(
      "flex cursor-pointer items-center gap-1.5 rounded px-3 py-1.5 text-xs duration-200 ease-in-out",
      isActive
        ? "bg-background-brand-bold text-font-inverse"
        : "text-font-subtle hover:bg-background-neutral-hovered"
    )}
  >
    <Icon size={14} />
    {label}
  </button>
);

interface BoardModeToggleProps {
  mode: BoardMode;
  setMode: (mode: BoardMode) => void;
}

interface ModeButtonProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
  Icon: typeof BsKanban;
}

interface Props {
  project: Project;
}

const Categories = ({ categories }: CategoriesProps): JSX.Element => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [submittingIssues, setSubmittingIssues] = useState<IssueId[]>([]);
  const [prevCategories, setPrevCategories] = useState(categories);
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

  // Reset optimistic submissions when the categories data changes
  if (categories !== prevCategories) {
    setPrevCategories(categories);
    setSubmittingIssues([]);
  }

  // Data created
  useEventSource("board/issue/issue-event", {
    event: EVENTS.ISSUE_CREATED,
  });

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

  // Revalidate to update category columns on event received
  useEffect(() => {
    revalidate();
  }, [dataUpdated, revalidate]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <section className="mt-12 flex h-full flex-col">
      <span className="mb-2 block justify-self-end font-primary-light text-2xs text-font-subtlest">
        Press <Kbd>Shift</Kbd> + <Kbd>N</Kbd> to create a new issue
      </span>
      <div className="flex h-full gap-3">
        {categories.map((category) => (
          <CategoryColumn
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

interface CategoriesProps {
  categories: Category[];
}
