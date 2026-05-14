import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useRevalidator } from "@remix-run/react";
import { useEventSource } from "remix-utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
import { Button } from "@app/components/button";
import { MdViewKanban } from "react-icons/md";
import { AiOutlineBarChart } from "react-icons/ai";

type ViewMode = "board" | "gantt";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * Toggle buttons for switching between Board and Gantt views
 */
const ViewModeToggle = ({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps): JSX.Element => {
  return (
    <div className="ml-auto flex gap-2">
      <Button
        variant={viewMode === "board" ? "contained" : "subtlest"}
        color="primary"
        size="md"
        onClick={() => onViewModeChange("board")}
        className="flex items-center gap-2 px-3 py-1.5"
      >
        <MdViewKanban size={16} />
        <span className="font-primary text-xs">Board</span>
      </Button>
      <Button
        variant={viewMode === "gantt" ? "contained" : "subtlest"}
        color="primary"
        size="md"
        onClick={() => onViewModeChange("gantt")}
        className="flex items-center gap-2 px-3 py-1.5"
      >
        <AiOutlineBarChart size={16} />
        <span className="font-primary text-xs">Gantt</span>
      </Button>
    </div>
  );
};

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
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </section>
        {viewMode === "board" ? (
          <DndProvider backend={HTML5Backend}>
            <Categories categories={project.categories} />
          </DndProvider>
        ) : (
          <div className="mt-12 flex h-full flex-col">
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

const Categories = ({ categories }: CategoriesProps): JSX.Element => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [submittingIssues, setSubmittingIssues] = useState<IssueId[]>([]);
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

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
};

interface CategoriesProps {
  categories: Category[];
}
