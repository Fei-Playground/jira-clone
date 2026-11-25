import { beforeEach, describe, expect, it, vi } from "vitest";
import { createIssue } from "@infrastructure/db/issue";
import { action } from "./new";

vi.mock("@infrastructure/db/issue", () => ({
  createIssue: vi.fn(),
}));

const projectId = "jira-clone";

const createIssueFormData = (): FormData => {
  const formData = new FormData();
  formData.set("_action", "create");
  formData.set("title", "A new issue");
  formData.set("description", "An issue created from the board");
  formData.set("status", "TODO");
  formData.set("priority", "medium");
  formData.set("asignee", "daniel-serrano");
  formData.set("reporter", "daniel-serrano");
  formData.set("comments", "[]");
  return formData;
};

const createIssueOnBoard = async (search: string): Promise<Response> => {
  const request = new Request(`http://localhost/projects/${projectId}/board/issue/new${search}`, {
    method: "POST",
    body: createIssueFormData(),
  });

  const response = await action({
    request,
    url: new URL(request.url),
    pattern: "/projects/:projectId/board/issue/new",
    params: { projectId },
    context: {},
  });

  return response as Response;
};

describe("create issue action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(["priority", "Priority", "PRIORITY", "PrIoRiTy"])(
    "returns to the board keeping the canonical sort for ?sortBy=%s",
    async (sortBy) => {
      const response = await createIssueOnBoard(`?sortBy=${sortBy}`);

      expect(createIssue).toHaveBeenCalledTimes(1);
      expect(response.headers.get("Location")).toBe(`/projects/${projectId}/board?sortBy=priority`);
    }
  );

  it.each(["bananas", "PRIORITIES", "", undefined])(
    "returns to the board without a sort for ?sortBy=%s",
    async (sortBy) => {
      const response = await createIssueOnBoard(sortBy === undefined ? "" : `?sortBy=${sortBy}`);

      expect(response.headers.get("Location")).toBe(`/projects/${projectId}/board`);
    }
  );
});
