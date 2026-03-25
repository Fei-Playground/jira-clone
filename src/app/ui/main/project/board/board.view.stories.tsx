import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useRef, useEffect } from "react";
import { createMemoryRouter, RouterProvider, Link, Outlet } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop, useDrag } from "react-dnd";
import cx from "classix";
import { AiOutlinePlus } from "react-icons/ai";
import { RxValueNone } from "react-icons/rx";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { HiFlag } from "react-icons/hi";
import { BsClockHistory } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";

import { projectMock1, projectMock2 } from "@domain/project";
import { Category, categoryTypeDict } from "@domain/category";
import { Issue, IssueId } from "@domain/issue";
import { sortList, DEFAULT_SORT, Sort } from "@domain/filter";
import type { Project } from "@domain/project";
import type { User } from "@domain/user";

import { ScrollArea } from "@app/components/scroll-area";
import { Kbd } from "@app/components/kbd-placeholder";
import { Tooltip } from "@app/components/tooltip";
import { PriorityIcon } from "@app/components/priority-icon";
import { UserAvatar } from "@app/components/user-avatar";

// Create a context provider for project that can be used without Remix
import { createContext, useContext, Dispatch, SetStateAction } from "react";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const ProjectContext = createContext<ProjectStore | undefined>(undefined);

const useProjectStore = (): ProjectStore => {
  const projectStore = useContext(ProjectContext);
  if (!projectStore) {
    throw new Error("Project context not found");
  }
  return projectStore;
};

const ProjectContextProvider = ({
  project,
  children,
}: {
  project: Project;
  children: JSX.Element;
}): JSX.Element => {
  const [search, setSearch] = useState("");
  return (
    <ProjectContext.Provider value={{ project, search, setSearch }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Story-safe Search component
const SearchForStory = (): JSX.Element => {
  const { search, setSearch } = useProjectStore();
  const clearSearch = () => setSearch("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative w-fit">
      <input
        type="text"
        name="search"
        value={search}
        placeholder="Filter issues"
        onChange={handleChange}
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
          <span className="flex border-none justify-center items-center font-icon z-10">
            <BiSearch size={16} />
          </span>
        ) : (
          <button
            onMouseDown={clearSearch}
            className="flex border-none justify-center items-center font-icon z-10 cursor-pointer rounded hover:bg-background-neutral"
            aria-label="Clear search"
          >
            <IoCloseOutline size={16} />
          </button>
        )}
      </span>
    </div>
  );
};

// Story-safe SelectSort component (no Remix Form/useSubmit)
const SelectSortForStory = (): JSX.Element => {
  return (
    <div className="flex cursor-pointer items-center justify-center rounded border-none bg-background-brand-subtlest px-3 py-1.5 text-xs text-font-brand hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed">
      <div className="mr-2 flex items-center">
        <FaSortAmountDownAlt size={14} />
      </div>
      <span>Sort by {DEFAULT_SORT}</span>
    </div>
  );
};

// Story-safe UserAvatarList
const UserAvatarListForStory = ({ users }: { users: User[] }): JSX.Element => {
  const maxVisibleUsers = 3;
  const visibleUsers = users.slice(0, maxVisibleUsers);
  const remainingCount = users.length - maxVisibleUsers;

  return (
    <div className="flex -space-x-2">
      {visibleUsers.map((user) => (
        <Tooltip key={user.id} content={user.name}>
          <span className="inline-block">
            <UserAvatar {...user} size={28} />
          </span>
        </Tooltip>
      ))}
      {remainingCount > 0 && (
        <span className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background-neutral text-2xs font-medium">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

// Drag and drop constants
const DRAG_ISSUE_CARD = "ISSUE_CARD";

interface DropItem {
  issueId: IssueId;
  categoryId: string;
}

// Story-safe IssueCard
const IssueCardForStory = ({
  issue,
  categoryId,
  handleDragging,
}: {
  issue: Issue;
  categoryId: string;
  handleDragging: (isDragging: boolean) => void;
}): JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DRAG_ISSUE_CARD,
      item: { issueId: issue.id, categoryId },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [issue.id, categoryId]
  );

  useEffect(() => {
    handleDragging(isDragging);
  }, [isDragging, handleDragging]);

  const user = issue.asignee;

  return (
    <div
      ref={dragRef}
      className={cx(
        "flex min-h-[100px] cursor-grab flex-col rounded border-none bg-elevation-surface-raised p-2 shadow-issue-card duration-200 ease-in-out hover:bg-elevation-surface-raised-hovered active:bg-elevation-surface-raised-pressed",
        isDragging && "opacity-50"
      )}
    >
      <span className="mb-3 block font-primary-light text-xs text-font">
        {issue.name}
      </span>
      <div className="mt-auto flex items-center justify-between">
        <span className="flex gap-2">
          <PriorityIcon priority={issue.priority} />
          <span className="rounded bg-background-information-bold px-1 py-0.5 text-3xs text-font-inverse">
            JC-{issue.id.slice(0, 4)}
          </span>
        </span>
        {user && (
          <Tooltip content={user.name}>
            <span>
              <UserAvatar {...user} tooltip={false} size={24} />
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

// Story-safe CategoryColumn
const CategoryColumnForStory = ({
  category,
  isDragging,
  submittingIssues,
  setSubmittingIssues,
  handleDragging,
}: {
  category: Category;
  isDragging: boolean;
  submittingIssues: IssueId[];
  setSubmittingIssues: Dispatch<SetStateAction<IssueId[]>>;
  handleDragging: (isDragging: boolean) => void;
}): JSX.Element => {
  const [columnHeight, setColumnHeight] = useState<number>(0);
  const columnRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { search } = useProjectStore();
  const emptyCategory = category.issues.length === 0;
  const issueLink = `issue/new?category=${category.type}`;

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: DRAG_ISSUE_CARD,
      drop: (item: DropItem) => {
        // In story mode, we don't actually update anything
        console.log("Would update issue", item.issueId, "to category", category.id);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [category.id]
  );

  const filteredIssues = (): Issue[] =>
    category.issues.filter((issue) => {
      return issue.name.toLowerCase().includes(search.toLowerCase());
    });

  useEffect(() => {
    if (columnRef.current) {
      setColumnHeight(columnRef.current.offsetHeight);
    }
  }, []);

  return (
    <div
      ref={dropRef}
      className="relative flex h-full w-[260px] max-w-[260px] flex-col rounded-md bg-elevation-surface-sunken"
    >
      {/* Column drop area */}
      <div
        className={cx(
          "absolute z-50 box-border h-[100%] w-[100%] rounded p-1.5 duration-200",
          isDragging ? "visible" : "hidden",
          isOver || "bg-background-drop"
        )}
      >
        <div
          className={cx(
            "relative h-full w-full rounded border-[3px]",
            isDragging ? "visible" : "hidden",
            isOver
              ? "border-solid border-border-success"
              : "flex items-center justify-center border-dashed border-border-brand"
          )}
        >
          {!isOver && (
            <span className="rounded bg-elevation-surface px-1">DROP HERE</span>
          )}
        </div>
      </div>
      {/* Column header */}
      <div className="sticky left-0 top-0 flex justify-between px-3 py-2.5 font-primary-light text-xs uppercase text-font-subtlest duration-200 ease-in-out">
        <span className="flex gap-2">
          <span>{category.name}</span>
          {!emptyCategory && <span>( {category.issues.length} )</span>}
        </span>
        <span
          className="cursor-pointer rounded p-1 hover:bg-background-neutral"
          aria-label="Add new issue"
        >
          <AiOutlinePlus size={16} />
        </span>
      </div>
      {/* Column issues */}
      <div ref={columnRef} className="flex flex-1 flex-col">
        <ScrollArea maxHeight={columnHeight > 0 ? columnHeight : 400}>
          {filteredIssues().length > 0 ? (
            <div className="flex flex-col gap-1 px-1 pb-1">
              {filteredIssues().map((issue) => (
                <IssueCardForStory
                  key={issue.id}
                  issue={issue}
                  categoryId={category.id}
                  handleDragging={handleDragging}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-3">
              <RxValueNone className="text-icon-disabled" size={36} />
              <span className="text-center font-primary-light text-xs text-font-subtlest">
                {search.length > 0
                  ? "No matching issues"
                  : "No issues yet"}
              </span>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

// A Story-safe version of BoardView that doesn't use Remix hooks
const BoardViewForStory = ({ project }: { project: Project }): JSX.Element => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [submittingIssues, setSubmittingIssues] = useState<IssueId[]>([]);

  return (
    <ProjectContextProvider project={project}>
      <div className="box-border flex h-full flex-col">
        <section className="flex items-center">
          <SearchForStory />
          <div className="mx-4 my-0 inline">
            <UserAvatarListForStory users={project.users} />
          </div>
          <div className="inline">
            <SelectSortForStory />
          </div>
        </section>
        <DndProvider backend={HTML5Backend}>
          <section className="mt-12 flex h-full flex-col">
            <span className="mb-2 block justify-self-end font-primary-light text-2xs text-font-subtlest">
              Press <Kbd>Shift</Kbd> + <Kbd>N</Kbd> to create a new issue
            </span>
            <div className="flex h-full gap-3">
              {project.categories.map((category) => (
                <CategoryColumnForStory
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
        </DndProvider>
      </div>
    </ProjectContextProvider>
  );
};

const meta: Meta<typeof BoardViewForStory> = {
  title: "Views/Board/BoardView",
  component: BoardViewForStory,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full p-4 bg-elevation-surface">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BoardViewForStory>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};

export const SecondProject: Story = {
  args: {
    project: projectMock2,
  },
};

export const EmptyCategories: Story = {
  args: {
    project: {
      ...projectMock1,
      categories: projectMock1.categories.map((cat) => ({
        ...cat,
        issues: [],
      })),
    },
  },
};
