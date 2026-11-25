// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Sort } from "@domain/filter";

const findUniqueMock = vi.fn();

vi.mock("./db.server", () => ({
  db: { project: { findUnique: (...args: unknown[]) => findUniqueMock(...args) } },
}));

import { getProject } from "./project";

const issue = (id: string, name: string, createdAt: string) => ({
  id,
  name,
  priority: { id: "low", name: "Low", order: 0 },
  createdAt: new Date(createdAt),
  reporter: null,
  asignee: null,
});

const projectDb = {
  id: "project-1",
  name: "Project",
  description: "A project",
  image: "project.png",
  createdAt: new Date("2022-01-01"),
  updatedAt: new Date("2022-01-01"),
  users: [],
  categories: [
    {
      id: "category-1",
      name: "To do",
      type: "TODO",
      order: 0,
      // The order the database hands them back for the default (date) sort.
      issues: [
        issue("issue-1", "pear", "2022-01-04"),
        issue("issue-2", "HINT: Check network status", "2022-01-03"),
        issue("issue-3", "banana", "2022-01-02"),
        issue("issue-4", "apple pie", "2022-01-01"),
      ],
    },
  ],
};

type ProjectQuery = {
  include: { categories: { include: { issues: { orderBy: unknown } } } };
};

describe("getProject issue sorting", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    findUniqueMock.mockResolvedValue(projectDb);
  });

  const namesFor = async (options?: { sortIssuesBy: Sort }): Promise<string[]> => {
    const project = await getProject("project-1", options);

    return project?.categories[0].issues.map((issue) => issue.name) ?? [];
  };

  const orderByFor = async (options?: { sortIssuesBy: Sort }): Promise<unknown> => {
    findUniqueMock.mockClear();
    await getProject("project-1", options);

    const query = findUniqueMock.mock.calls[0][0] as ProjectQuery;

    return query.include.categories.include.issues.orderBy;
  };

  it("orders the issues by title A to Z, ignoring letter case", async () => {
    expect(await namesFor({ sortIssuesBy: "title" })).toEqual([
      "apple pie",
      "banana",
      "HINT: Check network status",
      "pear",
    ]);
  });

  it("leaves the other sorts to the query", async () => {
    const queryOrder = ["pear", "HINT: Check network status", "banana", "apple pie"];

    expect(await namesFor({ sortIssuesBy: "date" })).toEqual(queryOrder);
    expect(await namesFor({ sortIssuesBy: "priority" })).toEqual(queryOrder);
  });

  it("asks the database for the issues in the order the sort calls for", async () => {
    const dateFirst = [{ createdAt: "desc" }, { priority: { order: "desc" } }];
    const priorityFirst = [{ priority: { order: "desc" } }, { createdAt: "desc" }];

    expect(await orderByFor({ sortIssuesBy: "date" })).toEqual(dateFirst);
    // The title sort is applied in memory, so the query keeps the default order.
    expect(await orderByFor({ sortIssuesBy: "title" })).toEqual(dateFirst);
    expect(await orderByFor({ sortIssuesBy: "priority" })).toEqual(priorityFirst);
    // The analytics loader calls getProject without options: it used to land in
    // the priority branch and now lands in the default (date) branch.
    expect(await orderByFor()).toEqual(dateFirst);
  });
});
