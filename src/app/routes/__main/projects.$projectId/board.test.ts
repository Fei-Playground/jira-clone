// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const getProjectMock = vi.fn();

vi.mock("@infrastructure/db/project", () => ({
  getProject: (projectId: string, options?: unknown) =>
    getProjectMock(projectId, options),
}));

import { loader } from "./board";

describe("board loader sortBy", () => {
  beforeEach(() => {
    getProjectMock.mockReset();
    getProjectMock.mockResolvedValue({ id: "project-1", name: "Project" });
  });

  const sortIssuesByFor = async (search: string): Promise<string | undefined> => {
    await loader({
      request: new Request(`http://localhost/projects/project-1/board${search}`),
      params: { projectId: "project-1" },
    } as unknown as Parameters<typeof loader>[0]);

    const lastCall = getProjectMock.mock.calls.at(-1) as [string, { sortIssuesBy?: string }];
    return lastCall?.[1]?.sortIssuesBy;
  };

  it("sorts by priority for ?sortBy=priority", async () => {
    expect(await sortIssuesByFor("?sortBy=priority")).toBe("priority");
  });

  it("sorts by priority for ?sortBy=Priority and ?sortBy=PRIORITY", async () => {
    expect(await sortIssuesByFor("?sortBy=Priority")).toBe("priority");
    expect(await sortIssuesByFor("?sortBy=PRIORITY")).toBe("priority");
  });

  it("sorts by date for ?sortBy=date, ?sortBy=Date and ?sortBy=DATE", async () => {
    expect(await sortIssuesByFor("?sortBy=date")).toBe("date");
    expect(await sortIssuesByFor("?sortBy=Date")).toBe("date");
    expect(await sortIssuesByFor("?sortBy=DATE")).toBe("date");
  });

  it("sorts by title for ?sortBy=title, ?sortBy=Title and ?sortBy=TITLE", async () => {
    expect(await sortIssuesByFor("?sortBy=title")).toBe("title");
    expect(await sortIssuesByFor("?sortBy=Title")).toBe("title");
    expect(await sortIssuesByFor("?sortBy=TITLE")).toBe("title");
  });

  it("ignores a sort that is not known, in any case", async () => {
    expect(await sortIssuesByFor("?sortBy=createdAt")).toBe("date");
    expect(await sortIssuesByFor("?sortBy=PRIORITIES")).toBe("date");
    expect(await sortIssuesByFor("?sortBy=")).toBe("date");
    expect(await sortIssuesByFor("")).toBe("date");
  });
});
