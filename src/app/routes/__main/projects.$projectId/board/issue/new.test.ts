// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const createIssueMock = vi.fn();

vi.mock("@infrastructure/db/issue", () => ({
  createIssue: (data: unknown) => createIssueMock(data),
}));

import { action } from "./new";

const createIssueRequest = (search: string): Request => {
  const formData = new FormData();
  formData.set("_action", "create");
  formData.set("title", "A new issue");
  formData.set("description", "A new issue description");
  formData.set("status", "TODO");
  formData.set("priority", "low");
  formData.set("asignee", "user-1");
  formData.set("reporter", "user-1");
  formData.set("comments", "[]");

  return new Request(`http://localhost/projects/project-1/board/issue/new${search}`, {
    method: "POST",
    body: formData,
  });
};

const runAction = async (search: string): Promise<Response> => {
  const response = await action({
    request: createIssueRequest(search),
    params: { projectId: "project-1" },
  } as unknown as Parameters<typeof action>[0]);

  return response as Response;
};

describe("create issue action sortBy", () => {
  beforeEach(() => {
    createIssueMock.mockReset();
    createIssueMock.mockResolvedValue(undefined);
  });

  it("returns to the board keeping the canonical lower-case sort", async () => {
    const response = await runAction("?sortBy=PRIORITY");

    expect(createIssueMock).toHaveBeenCalledTimes(1);
    expect(response.headers.get("Location")).toBe("/projects/project-1/board?sortBy=priority");
  });

  it("returns to the board without a sort when the sort is not known", async () => {
    const response = await runAction("?sortBy=PRIORITIES");

    expect(createIssueMock).toHaveBeenCalledTimes(1);
    expect(response.headers.get("Location")).toBe("/projects/project-1/board");
  });
});
