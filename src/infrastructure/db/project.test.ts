// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

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
        issue("issue-1", "pear", "2022-01-03"),
        issue("issue-2", "Apple", "2022-01-02"),
        issue("issue-3", "banana", "2022-01-01"),
      ],
    },
  ],
};

describe("getProject issue sorting", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    findUniqueMock.mockResolvedValue(projectDb);
  });

  const namesFor = async (sortIssuesBy: "date" | "priority" | "title"): Promise<string[]> => {
    const project = await getProject("project-1", { sortIssuesBy });

    return project?.categories[0].issues.map((issue) => issue.name) ?? [];
  };

  it("orders the issues by title A to Z, ignoring letter case", async () => {
    expect(await namesFor("title")).toEqual(["Apple", "banana", "pear"]);
  });

  it("leaves the other sorts to the query", async () => {
    expect(await namesFor("date")).toEqual(["pear", "Apple", "banana"]);
    expect(await namesFor("priority")).toEqual(["pear", "Apple", "banana"]);
  });
});
