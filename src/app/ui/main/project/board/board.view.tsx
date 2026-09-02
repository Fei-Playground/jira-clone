import { useState, useCallback, useEffect, Dispatch, SetStateAction } from "react";
import { Outlet, useNavigate, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import cx from "classix";
import { MdChecklist } from "react-icons/md";
import { Project } from "@domain/project";
import { Category } from "@domain/category";
import { IssueId } from "@domain/issue";
import { Search } from "@app/ui/main/project/board/search";
import { Kbd } from "@app/components/kbd-placeholder";
import { UserAvatarList } from "./avatar-list";
import { SelectSort } from "./select-sort";
import { CategoryColumn } from "./category-column";
import { BulkActionsBar } from "./bulk-actions-bar";
import { ProjectContextProvider, useProjectStore } from "../project.store";
import { EVENTS } from "@app/events";

export const BoardView = ({ project }: Props): JSX.Element => {
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
          <div className="ml-2 inline">
            <SelectToggle />
          </div>
        </section>
        <DndProvider backend={HTML5Backend}>
          <Categories categories={project.categories} />
        </DndProvider>
        <Outlet />
      </div>
    </ProjectContextProvider>
  );
};

interface Props {
  project: Project;
}

const SelectToggle = (): JSX.Element => {
  const { isSelectMode, setIsSelectMode, selectedIssueIds, setSelectedIssueIds } =
    useProjectStore();

  const handleToggle = () => {
    if (isSelectMode) {
      setSelectedIssueIds([]);
    }
    setIsSelectMode((prev) => !prev);
  };

  return (
    <button
      onClick={handleToggle}
      className={cx(
        "flex cursor-pointer items-center justify-center rounded border-none px-3 py-1.5 text-xs",
        isSelectMode
          ? "bg-background-brand-bold text-font-inverse hover:bg-background-brand-bold-hovered active:bg-background-brand-bold-pressed"
          : "bg-background-brand-subtlest text-font-brand hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
      )}
      aria-label={isSelectMode ? "Exit select mode" : "Enter select mode"}
    >
      <MdChecklist size={16} className="mr-1.5" />
      {isSelectMode
        ? `Select (${selectedIssueIds.length})`
        : "Select"}
    </button>
  );
};

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
      <BulkActionsBar
        categories={categories}
        setSubmittingIssues={setSubmittingIssues}
      />
    </section>
  );
};

interface CategoriesProps {
  categories: Category[];
}
