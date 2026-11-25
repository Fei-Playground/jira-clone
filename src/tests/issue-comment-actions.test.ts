import { describe, expect, it, vi } from "vitest";
import { commentMock1, commentMock2, Comment } from "@domain/comment";
import { userMock1 } from "@domain/user";

vi.mock("@infrastructure/db/issue", () => ({
  getIssue: vi.fn(),
  updateIssue: vi.fn(),
  deleteIssue: vi.fn(),
  createIssue: vi.fn(),
}));
vi.mock("@infrastructure/db/comment", () => ({
  deleteComment: vi.fn(),
}));

import { createIssue, updateIssue } from "@infrastructure/db/issue";
import { action as updateIssueAction } from "@app/routes/__main/projects.$projectId/board/issue/$issueId";
import { action as createIssueAction } from "@app/routes/__main/projects.$projectId/board/issue/new";

const updateIssueMock = vi.mocked(updateIssue);
const createIssueMock = vi.mocked(createIssue);

const projectId = "48a0e6d2-6a13-4a1f-9a5f-8f1f4d1a9d3a";
const issueId = "4db55cbf-222d-424a-b23b-08e61534c706";

const requestFor = (fields: Record<string, string>): Request => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));

  return new Request(`http://localhost/projects/${projectId}/board/issue/${issueId}`, {
    method: "POST",
    body: formData,
  });
};

const actionArgs = (request: Request) => ({
  request,
  params: { projectId, issueId },
  context: {},
  unstable_url: new URL(request.url),
  unstable_pattern: "/projects/:projectId/board/issue/:issueId",
});

// An action is typed as returning anything, so narrow it to the response the
// route hands back before reading the redirect it carries.
const asResponse = (result: unknown): Response => {
  if (!(result instanceof Response)) {
    throw new Error(`The action did not return a response: ${result}`);
  }

  return result;
};

const issueFields = (
  _action: "create" | "update",
  comments: Comment[]
): Record<string, string> => ({
  _action,
  title: "Issue title",
  description: "Issue description",
  status: "TODO",
  priority: "low",
  asignee: userMock1.id,
  reporter: userMock1.id,
  comments: JSON.stringify(comments),
});

const paddedComments: Comment[] = [
  { ...commentMock1, message: "   Studio check   " },
  { ...commentMock2, message: " \t\n " },
];

const trimmedComments: Comment[] = [{ ...commentMock1, message: "Studio check" }];

describe("saving an issue with its comments", () => {
  it("stores the updated issue's comments trimmed, dropping the ones the trim leaves empty", async () => {
    const request = requestFor(issueFields("update", paddedComments));

    const response = asResponse(await updateIssueAction(actionArgs(request)));

    expect(updateIssueMock).toHaveBeenCalledTimes(1);
    expect(updateIssueMock.mock.calls[0][0].comments).toEqual(trimmedComments);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(`/projects/${projectId}/board`);
  });

  it("stores a new issue's comments trimmed, dropping the ones the trim leaves empty", async () => {
    const request = requestFor(issueFields("create", paddedComments));

    const response = asResponse(await createIssueAction(actionArgs(request)));

    expect(createIssueMock).toHaveBeenCalledTimes(1);
    expect(createIssueMock.mock.calls[0][0].comments).toEqual(trimmedComments);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(`/projects/${projectId}/board`);
  });
});
