// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { ActionFunction } from "react-router";
import { action as editIssueAction } from "@app/routes/__main/projects.$projectId/board/issue/$issueId";
import { action as createIssueAction } from "@app/routes/__main/projects.$projectId/board/issue/new";

const db = vi.hoisted(() => ({
  updateIssue: vi.fn(),
  createIssue: vi.fn(),
  deleteIssue: vi.fn(),
  getIssue: vi.fn(),
  deleteComment: vi.fn(),
}));

vi.mock("@infrastructure/db/issue", () => ({
  getIssue: db.getIssue,
  updateIssue: db.updateIssue,
  createIssue: db.createIssue,
  deleteIssue: db.deleteIssue,
}));

vi.mock("@infrastructure/db/comment", () => ({
  deleteComment: db.deleteComment,
}));

const EDIT_URL = "http://localhost/projects/project-1/board/issue/issue-1";
const NEW_URL = "http://localhost/projects/project-1/board/issue/new";
const EDIT_PARAMS = { projectId: "project-1", issueId: "issue-1" };
const NEW_PARAMS = { projectId: "project-1" };

/**
 * The router's `json()`/`redirect()` helpers return either a `Response` or a
 * `DataWithResponseInit`; the action is read the same way the router reads it.
 */
type RouteResult =
  | Response
  | { type: "DataWithResponseInit"; data: unknown; init?: { status?: number } };

const asResponse = (result: RouteResult): Response => {
  if (result instanceof Response) return result;

  return new Response(JSON.stringify(result.data), {
    status: result.init?.status ?? 200,
    headers: { "Content-Type": "application/json" },
  });
};

const issueFields = (title: string): Record<string, string> => ({
  _action: "update",
  title,
  description: "A description",
  status: "TODO",
  priority: "low",
  asignee: "user-2",
  reporter: "user-1",
  comments: "[]",
});

const newIssueFields = (title: string): Record<string, string> => ({
  ...issueFields(title),
  _action: "create",
});

const post = async (
  action: ActionFunction,
  url: string,
  params: Record<string, string>,
  fields: Record<string, string>
): Promise<Response> => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  const request = new Request(url, { method: "POST", body: formData });
  const result = (await action({
    request,
    params,
  } as unknown as Parameters<ActionFunction>[0])) as RouteResult;

  return asResponse(result);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("editing an existing issue", () => {
  test.each(["", "   ", "\t", "\n", " \t \n "])(
    "refuses the title %j and keeps the previous title",
    async (title) => {
      const response = await post(editIssueAction, EDIT_URL, EDIT_PARAMS, issueFields(title));

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        errors: { name: "Title is required" },
      });
      expect(db.updateIssue).not.toHaveBeenCalled();
    }
  );

  test("refuses a submission with no title field at all", async () => {
    const withoutTitle = issueFields("");
    delete withoutTitle.title;

    const response = await post(editIssueAction, EDIT_URL, EDIT_PARAMS, withoutTitle);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errors: { name: "Title is required" },
    });
    expect(db.updateIssue).not.toHaveBeenCalled();
  });

  test("trims the title before saving it", async () => {
    const response = await post(
      editIssueAction,
      EDIT_URL,
      EDIT_PARAMS,
      issueFields("  Trimmed on save  ")
    );

    expect(db.updateIssue).toHaveBeenCalledWith({
      id: "issue-1",
      name: "Trimmed on save",
      description: "A description",
      categoryId: "TODO",
      priority: "low",
      asigneeId: "user-2",
      reporterId: "user-1",
      comments: [],
    });
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/projects/project-1/board");
  });
});

describe("creating a new issue", () => {
  test.each(["", "   ", "\t", "\n", " \t \n "])(
    "refuses the title %j and creates nothing",
    async (title) => {
      const response = await post(createIssueAction, NEW_URL, NEW_PARAMS, newIssueFields(title));

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        errors: { name: "Title is required" },
      });
      expect(db.createIssue).not.toHaveBeenCalled();
    }
  );

  test("refuses a submission with no title field at all", async () => {
    const withoutTitle = newIssueFields("");
    delete withoutTitle.title;

    const response = await post(createIssueAction, NEW_URL, NEW_PARAMS, withoutTitle);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errors: { name: "Title is required" },
    });
    expect(db.createIssue).not.toHaveBeenCalled();
  });

  test("trims the title before creating the issue", async () => {
    const response = await post(
      createIssueAction,
      NEW_URL,
      NEW_PARAMS,
      newIssueFields("  Trimmed on save  ")
    );

    expect(db.createIssue).toHaveBeenCalledWith({
      name: "Trimmed on save",
      description: "A description",
      categoryId: "TODO",
      priority: "low",
      asigneeId: "user-2",
      reporterId: "user-1",
      comments: [],
    });
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/projects/project-1/board");
  });
});
