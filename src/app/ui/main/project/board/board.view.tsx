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
import { ProjectContextProvider } from "../project.store";
import { EVENTS } from "@app/events";

export const BoardView = ({ project }: Props): JSX.Element => {
  return (
    <ProjectContextProvider project={project}>
      <div className="box-border flex h-full flex-col bg-elevation-surface px-8 py-8">
        <section className="mb-6 flex items-center gap-4 bg-elevation-surface">
          <Search />
          <div className="inline">
            <UserAvatarList users={project.users} />
          </div>
          <div className="inline">
            <SelectSort />
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
    <section className="flex h-full flex-col bg-elevation-surface px-8 py-8">
      <span className="mb-4 block justify-self-end font-primary-light text-2xs text-font-subtlest">
        Press <Kbd>Shift</Kbd> + <Kbd>N</Kbd> to create a new issue
      </span>
      <div className="flex h-full gap-6">
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
