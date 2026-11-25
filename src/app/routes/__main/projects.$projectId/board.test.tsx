import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { Category } from "@domain/category";
import { Sort } from "@domain/filter";
import { Issue } from "@domain/issue";
import { Project } from "@domain/project";
import {
  Priority,
  priorityHigh,
  priorityLow,
  priorityMedium,
} from "@domain/priority";
import { userMock1 } from "@domain/user";
import { getProject } from "@infrastructure/db/project";
import BoardRoute, { loader } from "./board";

vi.mock("@infrastructure/db/project", () => ({
  getProject: vi.fn(),
}));

vi.mock("@infrastructure/db/issue", () => ({
  updateIssueCategory: vi.fn(),
}));

// jsdom ships neither of these, and the board needs them to mount.
beforeEach(() => {
  vi.stubGlobal(
    "EventSource",
    class {
      addEventListener(): void {}
      removeEventListener(): void {}
      close(): void {}
    }
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const projectId = "jira-clone";
const SORT_SELECT_LABEL = "Open sort issues select";

const createIssue = (
  id: string,
  priority: Priority,
  createdAt: number
): Issue => ({
  id,
  name: id,
  reporter: userMock1,
  asignee: userMock1,
  comments: [],
  priority,
  createdAt,
  updatedAt: createdAt,
});

// The three issues have opposite date and priority orders, so the rendered
// order tells which sort the loader asked getProject for.
const categories: Category[] = [
  {
    id: "category-todo",
    type: "TODO",
    name: "To do",
    order: 0,
    issues: [
      createIssue("high-priority", priorityHigh, 1),
      createIssue("low-priority", priorityLow, 3),
      createIssue("medium-priority", priorityMedium, 2),
    ],
  },
];

const project: Project = {
  id: projectId,
  name: "JIRA Clone",
  users: [userMock1],
  categories,
  image: "",
};

// Mirrors getProject: the requested sort decides, the other column breaks ties.
const orderIssues = (issues: Issue[], sortBy: Sort): Issue[] =>
  [...issues].sort((a, b) =>
    sortBy === "date"
      ? b.createdAt - a.createdAt || b.priority.order - a.priority.order
      : b.priority.order - a.priority.order || b.createdAt - a.createdAt
  );

const BoardStub = createRoutesStub([
  { path: "/projects/:projectId/board", Component: BoardRoute, loader },
]);

const renderBoard = (search: string): void => {
  render(
    <BoardStub initialEntries={[`/projects/${projectId}/board${search}`]} />
  );
};

const findSortSelect = () => screen.findByLabelText(SORT_SELECT_LABEL);

const sortLabel = (): string =>
  within(screen.getByLabelText(SORT_SELECT_LABEL)).getByText(/^Sort by /)
    .textContent ?? "";

const boardLinks = (): string[] =>
  screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");

describe("board sort from the URL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getProject).mockImplementation(async (_projectId, options) => ({
      ...project,
      categories: project.categories.map((category) => ({
        ...category,
        issues: orderIssues(category.issues, options?.sortIssuesBy ?? "date"),
      })),
    }));
  });

  it.each(["priority", "Priority", "PRIORITY", "PrIoRiTy"])(
    "sorts by priority for ?sortBy=%s",
    async (sortBy) => {
      renderBoard(`?sortBy=${sortBy}`);
      await findSortSelect();

      expect(getProject).toHaveBeenCalledWith(projectId, {
        sortIssuesBy: "priority",
      });
      expect(sortLabel()).toBe("Sort by priority");
      expect(boardLinks()).toEqual([
        `/projects/${projectId}/board/issue/new?category=TODO&sortBy=priority`,
        `/projects/${projectId}/board/issue/high-priority?sortBy=priority`,
        `/projects/${projectId}/board/issue/medium-priority?sortBy=priority`,
        `/projects/${projectId}/board/issue/low-priority?sortBy=priority`,
      ]);
    }
  );

  it.each(["date", "Date", "DATE"])(
    "sorts by date for ?sortBy=%s",
    async (sortBy) => {
      renderBoard(`?sortBy=${sortBy}`);
      await findSortSelect();

      expect(getProject).toHaveBeenCalledWith(projectId, {
        sortIssuesBy: "date",
      });
      expect(sortLabel()).toBe("Sort by date");
      expect(boardLinks()).toEqual([
        `/projects/${projectId}/board/issue/new?category=TODO&sortBy=date`,
        `/projects/${projectId}/board/issue/low-priority?sortBy=date`,
        `/projects/${projectId}/board/issue/medium-priority?sortBy=date`,
        `/projects/${projectId}/board/issue/high-priority?sortBy=date`,
      ]);
    }
  );

  it.each(["bananas", "PRIORITIES", "", undefined])(
    "falls back to the default date sort for ?sortBy=%s",
    async (sortBy) => {
      renderBoard(sortBy === undefined ? "" : `?sortBy=${sortBy}`);
      await findSortSelect();

      expect(getProject).toHaveBeenCalledWith(projectId, {
        sortIssuesBy: "date",
      });
      expect(sortLabel()).toBe("Sort by date");
      expect(boardLinks()).toEqual([
        `/projects/${projectId}/board/issue/new?category=TODO`,
        `/projects/${projectId}/board/issue/low-priority`,
        `/projects/${projectId}/board/issue/medium-priority`,
        `/projects/${projectId}/board/issue/high-priority`,
      ]);
    }
  );
});
