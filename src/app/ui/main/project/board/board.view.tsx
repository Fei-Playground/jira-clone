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
import { Button } from "@app/components/button";
import { UserAvatarList } from "./avatar-list";
import { SelectSort } from "./select-sort";
import { CategoryColumn } from "./category-column";
import { GanttChart } from "./gantt-chart";
import { ProjectContextProvider } from "../project.store";
import { EVENTS } from "@app/events";

export const BoardView = ({ project }: Props): JSX.Element => {
  const [viewMode, setViewMode] = useState<ViewMode>("board");

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
          <ViewModeButtons viewMode={viewMode} onViewModeChange={setViewMode} />
        </section>
        {viewMode === "board" ? (
          <DndProvider backend={HTML5Backend}>
            <Categories categories={project.categories} />
          </DndProvider>
        ) : (
          <GanttChart categories={project.categories} />
        )}
        <Outlet />
      </div>
    </ProjectContextProvider>
  );
};

interface Props {
  project: Project;
}

type ViewMode = "board" | "gantt";

// Renders view mode toggle buttons for switching between board and gantt views
const ViewModeButtons = ({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}): JSX.Element => (
  <div className="ml-4 inline flex gap-2">
    <Button
      variant={viewMode === "board" ? "contained" : "subtlest"}
      color="neutral"
      size="md"
      onClick={() => onViewModeChange("board")}
      className="text-xs"
      aria-label="Switch to board view"
    >
      Board
    </Button>
    <Button
      variant={viewMode === "gantt" ? "contained" : "subtlest"}
      color="neutral"
      size="md"
      onClick={() => onViewModeChange("gantt")}
      className="text-xs"
      aria-label="Switch to gantt view"
    >
      Gantt
    </Button>
  </div>
);

const Categories = ({ categories }: CategoriesProps): JSX.Element => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [submittingIssues, setSubmittingIssues] = useState<IssueId[]>([]);
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

  // Subscribe to issue events for real-time updates
  // ISSUE_CREATED is listened to but not explicitly used (implicitly triggers revalidate)
  useEventSource("board/issue/issue-event", {
    event: EVENTS.ISSUE_CREATED,
  });

  // Listen for issue changes to trigger data refresh
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
    setSubmittingIssues([]);
  }, [categories]);

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
}

interface CategoriesProps {
  categories: Category[];
}

