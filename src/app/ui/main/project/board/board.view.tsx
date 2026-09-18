import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BsKanban } from "react-icons/bs";
import { LuChartGantt } from "react-icons/lu";
import cx from "classix";
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

type ViewMode = "kanban" | "gantt";

export const BoardView = ({ project }: Props): JSX.Element => {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");

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
          <div className="ml-auto inline">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </section>
        {viewMode === "kanban" ? (
          <DndProvider backend={HTML5Backend}>
            <Categories categories={project.categories} />
          </DndProvider>
        ) : (
          <div className="mt-6 min-h-0 flex-grow">
            <GanttView categories={project.categories} />
          </div>
        )}
        <Outlet />
      </div>
    </ProjectContextProvider>
  );
};

interface Props {
  project: Project;
}

const ViewModeToggle = ({
  viewMode,
  setViewMode,
}: ViewModeToggleProps): JSX.Element => (
  <div
    role="group"
    aria-label="Board view mode"
    className="flex rounded border-none bg-background-neutral p-0.5"
  >
    <ViewModeButton
      label="Kanban"
      icon={<BsKanban size={14} />}
      isActive={viewMode === "kanban"}
      onClick={() => setViewMode("kanban")}
    />
    <ViewModeButton
      label="Gantt"
      icon={<LuChartGantt size={14} />}
      isActive={viewMode === "gantt"}
      onClick={() => setViewMode("gantt")}
    />
  </div>
);

interface ViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}

const ViewModeButton = ({
  label,
  icon,
  isActive,
  onClick,
}: ViewModeButtonProps): JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={isActive}
    aria-label={`Switch to ${label} view`}
    className={cx(
      "flex cursor-pointer items-center gap-1.5 rounded border-none px-3 py-1.5 text-xs",
      isActive
        ? "bg-background-brand-subtlest text-font-brand"
        : "text-font-subtlest hover:bg-background-neutral-hovered"
    )}
  >
    {icon}
    {label}
  </button>
);

interface ViewModeButtonProps {
  label: string;
  icon: JSX.Element;
  isActive: boolean;
  onClick: () => void;
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
