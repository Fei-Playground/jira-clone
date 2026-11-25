// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateIssueMock = vi.fn();
const deleteIssueMock = vi.fn();

vi.mock("@infrastructure/db/issue", () => ({
  getIssue: vi.fn(),
  updateIssue: (data: unknown) => updateIssueMock(data),
  deleteIssue: (id: unknown) => deleteIssueMock(id),
}));

vi.mock("@infrastructure/db/comment", () => ({
  deleteComment: vi.fn(),
}));

import { action } from "./$issueId";

const updateIssueRequest = (search: string): Request => {
  const formData = new FormData();
  formData.set("_action", "update");
  formData.set("title", "An updated issue");
  formData.set("description", "An updated issue description");
  formData.set("status", "TODO");
  formData.set("priority", "low");
  formData.set("asignee", "user-1");
  formData.set("reporter", "user-1");
  formData.set("comments", "[]");

  return new Request(`http://localhost/projects/project-1/board/issue/issue-1${search}`, {
    method: "POST",
    body: formData,
  });
};

const runAction = async (search: string): Promise<Response> => {
  const response = await action({
    request: updateIssueRequest(search),
    params: { projectId: "project-1", issueId: "issue-1" },
  } as unknown as Parameters<typeof action>[0]);

  return response as Response;
};

describe("update issue action sortBy", () => {
  beforeEach(() => {
    updateIssueMock.mockReset();
    updateIssueMock.mockResolvedValue(undefined);
    deleteIssueMock.mockReset();
    deleteIssueMock.mockResolvedValue(undefined);
  });

  it("returns to the board keeping the canonical lower-case sort", async () => {
    const response = await runAction("?sortBy=DATE");

    expect(updateIssueMock).toHaveBeenCalledTimes(1);
    expect(response.headers.get("Location")).toBe("/projects/project-1/board?sortBy=date");
  });

  it("returns to the board without a sort when the sort is not known", async () => {
    const response = await runAction("?sortBy=nope");

    expect(updateIssueMock).toHaveBeenCalledTimes(1);
    expect(response.headers.get("Location")).toBe("/projects/project-1/board");
  });
});
