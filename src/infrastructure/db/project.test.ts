import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db.server", () => ({
  db: {
    project: {
      findUnique: vi.fn(),
    },
  },
}));

import { db } from "./db.server";
import { getProject } from "./project";

const userRow = {
  id: "u1",
  name: "Ada Lovelace",
  image: null,
  color: "#4BADE8",
  createdAt: new Date("2022-01-18T11:00:00Z"),
  updatedAt: new Date("2022-01-18T11:00:00Z"),
};

// The board query reads `_count.comments` and never the comment rows, so the
// fixture only carries the count.
const issueRow = (id: string, comments: number) => ({
  id,
  name: `Issue ${id}`,
  priority: "high",
  createdAt: new Date("2022-01-20T11:00:00Z"),
  reporter: userRow,
  asignee: userRow,
  _count: { comments },
});

const projectRow = {
  id: "p1",
  name: "Project",
  description: null,
  image: "/images/default-project.png",
  createdAt: new Date("2022-01-18T11:00:00Z"),
  updatedAt: new Date("2022-01-23T11:00:00Z"),
  users: [userRow],
  categories: [
    {
      id: "c1",
      name: "To do",
      type: "TODO",
      order: 0,
      issues: [issueRow("i1", 2), issueRow("i2", 0)],
    },
  ],
};

const findUniqueMock = vi.mocked(db.project.findUnique);

const mockProjectRow = (row: typeof projectRow | null): void => {
  findUniqueMock.mockResolvedValue(row as unknown as Awaited<ReturnType<typeof findUniqueMock>>);
};

describe("getProject", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
  });

  it("maps the comments count of every board issue", async () => {
    mockProjectRow(projectRow);

    const project = await getProject("p1");
    const issues = project?.categories[0].issues ?? [];

    expect(issues.map((issue) => issue.commentsCount)).toEqual([2, 0]);
  });

  it("leaves the comment bodies out of the board payload", async () => {
    mockProjectRow(projectRow);

    const project = await getProject("p1");
    const issues = project?.categories[0].issues ?? [];

    expect(issues).toHaveLength(2);
    issues.forEach((issue) => expect(issue.comments).toEqual([]));
  });

  it("returns null when the project does not exist", async () => {
    mockProjectRow(null);

    expect(await getProject("p1")).toBeNull();
  });
});
