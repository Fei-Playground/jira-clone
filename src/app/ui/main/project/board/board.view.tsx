import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import cx from "classix";
import { Project } from "@domain/project";
import { Category } from "@domain/category";
import { IssueId } from "@domain/issue";
import { Search } from "@app/ui/main/project/board/search";
import { Kbd } from "@app/components/kbd-placeholder";
import { UserAvatarList } from "./avatar-list";
import { SelectSort } from "./select-sort";
import { PriorityFilter } from "./priority-filter";
import { CategoryColumn } from "./category-column";
import { GanttView } from "./gantt-view";
import { ProjectContextProvider } from "../project.store";
import { EVENTS } from "@app/events";

export const BoardView = ({ project }: Props): JSX.Element => {
  // Allow users to toggle between Kanban (card-based) and Gantt (timeline) views
  const [view, setView] = useState<"kanban" | "gantt">("kanban");

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
          <div className="mx-4 inline">
            <PriorityFilter />
          </div>
          <ViewToggle view={view} onViewChange={setView} />
        </section>
        {/* Render the appropriate view component based on user selection */}
        {view === "kanban" ? (
          <DndProvider backend={HTML5Backend}>
            <Categories categories={project.categories} />
          </DndProvider>
        ) : (
          <GanttView project={project} />
        )}
        <Outlet />
      </div>
    </ProjectContextProvider>
  );
};

interface Props {
  project: Project;
}

interface ViewToggleProps {
  view: "kanban" | "gantt";
  onViewChange: (view: "kanban" | "gantt") => void;
}

// Toggle button for switching between Kanban and Gantt views
const ViewToggle = ({ view, onViewChange }: ViewToggleProps): JSX.Element => {
  return (
    <div className="ml-auto flex overflow-hidden rounded border border-border">
      <button
        onClick={() => onViewChange("kanban")}
        className={cx(
          "px-3 py-1.5 font-primary text-xs",
          view === "kanban"
            ? "bg-background-brand-bold text-font-inverse"
            : "bg-transparent text-font-subtlest hover:bg-background-neutral"
        )}
        aria-label="Kanban view"
      >
        Kanban
      </button>
      <button
        onClick={() => onViewChange("gantt")}
        className={cx(
          "px-3 py-1.5 font-primary text-xs",
          view === "gantt"
            ? "bg-background-brand-bold text-font-inverse"
            : "bg-transparent text-font-subtlest hover:bg-background-neutral"
        )}
        aria-label="Gantt view"
      >
        Gantt
      </button>
    </div>
  );
}

interface CategoriesProps {
  categories: Category[];
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
