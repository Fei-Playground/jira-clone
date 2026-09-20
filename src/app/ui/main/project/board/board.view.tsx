import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import cx from "classix";
import { TbLayoutKanban, TbTimeline } from "react-icons/tb";
import { Project } from "@domain/project";
import { Category } from "@domain/category";
import { IssueId } from "@domain/issue";
import { Search } from "@app/ui/main/project/board/search";
import { Kbd } from "@app/components/kbd-placeholder";
import { UserAvatarList } from "./avatar-list";
import { SelectSort } from "./select-sort";
import { CategoryColumn } from "./category-column";
import { GanttView } from "./gantt";
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
          <div className="ml-4 inline">
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

interface Props {
  project: Project;
}

const BoardModeToggle = ({
  mode,
  setMode,
}: BoardModeToggleProps): JSX.Element => (
  <div className="flex rounded bg-background-neutral p-0.5">
    <button
      type="button"
      aria-label="Switch to kanban view"
      aria-pressed={mode === "kanban"}
      onClick={() => setMode("kanban")}
      className={cx(
        "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs duration-200 ease-in-out",
        mode === "kanban"
          ? "bg-background-selected text-font-brand"
          : "text-font-subtlest hover:bg-background-neutral-hovered"
      )}
    >
      <TbLayoutKanban size={16} />
      Kanban
    </button>
    <button
      type="button"
      aria-label="Switch to gantt view"
      aria-pressed={mode === "gantt"}
      onClick={() => setMode("gantt")}
      className={cx(
        "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs duration-200 ease-in-out",
        mode === "gantt"
          ? "bg-background-selected text-font-brand"
          : "text-font-subtlest hover:bg-background-neutral-hovered"
      )}
    >
      <TbTimeline size={16} />
      Gantt
    </button>
  </div>
);

interface BoardModeToggleProps {
  mode: BoardMode;
  setMode: (mode: BoardMode) => void;
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
