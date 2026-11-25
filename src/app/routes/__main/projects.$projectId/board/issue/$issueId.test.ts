import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteIssue, updateIssue } from "@infrastructure/db/issue";
import { action } from "./$issueId";

vi.mock("@infrastructure/db/issue", () => ({
  getIssue: vi.fn(),
  updateIssue: vi.fn(),
  deleteIssue: vi.fn(),
}));

vi.mock("@infrastructure/db/comment", () => ({
  deleteComment: vi.fn(),
}));

const projectId = "jira-clone";
const issueId = "4db55cbf-222d-424a-b23b-08e61534c706";

const issueFormData = (action: string): FormData => {
  const formData = new FormData();
  formData.set("_action", action);
  formData.set("title", "An issue from the board");
  formData.set("description", "Description");
  formData.set("status", "TODO");
  formData.set("priority", "medium");
  formData.set("asignee", "daniel-serrano");
  formData.set("reporter", "daniel-serrano");
  formData.set("comments", "[]");
  return formData;
};

const submitIssue = async (formAction: string, search: string): Promise<Response> => {
  const request = new Request(
    `http://localhost/projects/${projectId}/board/issue/${issueId}${search}`,
    { method: "POST", body: issueFormData(formAction) }
  );

  const response = await action({
    request,
    url: new URL(request.url),
    pattern: "/projects/:projectId/board/issue/:issueId",
    params: { projectId, issueId },
    context: {},
  });

  return response as Response;
};

describe("issue action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(["priority", "Priority", "PRIORITY", "PrIoRiTy"])(
    "returns to the board keeping the canonical sort after saving for ?sortBy=%s",
    async (sortBy) => {
      const response = await submitIssue("update", `?sortBy=${sortBy}`);

      expect(updateIssue).toHaveBeenCalledTimes(1);
      expect(response.headers.get("Location")).toBe(`/projects/${projectId}/board?sortBy=priority`);
    }
  );

  it.each(["date", "Date", "DATE"])(
    "returns to the board keeping the canonical sort after deleting for ?sortBy=%s",
    async (sortBy) => {
      const response = await submitIssue("delete", `?sortBy=${sortBy}`);

      expect(deleteIssue).toHaveBeenCalledTimes(1);
      expect(response.headers.get("Location")).toBe(`/projects/${projectId}/board?sortBy=date`);
    }
  );

  it.each(["bananas", "PRIORITIES", "", undefined])(
    "returns to the board without a sort for ?sortBy=%s",
    async (sortBy) => {
      const response = await submitIssue("delete", sortBy === undefined ? "" : `?sortBy=${sortBy}`);

      expect(response.headers.get("Location")).toBe(`/projects/${projectId}/board`);
    }
  );
});
