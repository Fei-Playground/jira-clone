// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs, Params } from "react-router";

vi.mock("@infrastructure/db/issue", () => ({
  createIssue: vi.fn(),
  deleteIssue: vi.fn(),
  getIssue: vi.fn(),
  updateIssue: vi.fn(),
}));

import { createIssue, updateIssue } from "@infrastructure/db/issue";
import { action as updateIssueAction, ActionData } from "./$issueId";
import { action as createIssueAction } from "./new";

const updateParams: Params = { projectId: "p1", issueId: "i1" };
const createParams: Params = { projectId: "p1" };

/**
 * The shape `json()` returns for an action that is called outside the router:
 * the payload plus the response init the router would use.
 */
interface ActionDataResult {
  data: ActionData;
  init?: { status?: number } | null;
}

/**
 * Builds the payload the issue panel posts. The title field is left out of the
 * form when `title` is `null`, which is how a form without it reaches the action.
 */
const requestWith = (
  action: "update" | "create",
  title: string | null
): Request => {
  const formData = new FormData();
  if (title !== null) formData.set("title", title);
  formData.set("description", "A description");
  formData.set("status", "TODO");
  formData.set("priority", "low");
  formData.set("asignee", "u2");
  formData.set("reporter", "u1");
  formData.set("comments", "[]");
  formData.set("_action", action);

  return new Request("http://localhost/projects/p1/board/issue", {
    method: "POST",
    body: formData,
  });
};

const runUpdateAction = async (title: string | null): Promise<unknown> =>
  updateIssueAction({
    request: requestWith("update", title),
    params: updateParams,
    context: {},
  } as ActionFunctionArgs);

const runCreateAction = async (title: string | null): Promise<unknown> =>
  createIssueAction({
    request: requestWith("create", title),
    params: createParams,
    context: {},
  } as ActionFunctionArgs);

const expectTitleRequired = (result: unknown): void => {
  const { data, init } = result as ActionDataResult;

  expect(data).toEqual({ errors: { name: "Title is required" } });
  expect(init?.status).toBe(400);
};

describe("editing an issue title", () => {
  beforeEach(() => {
    vi.mocked(updateIssue).mockClear();
  });

  it("refuses a title that is only spaces and keeps the stored title", async () => {
    const result = await runUpdateAction("   ");

    expectTitleRequired(result);
    expect(updateIssue).not.toHaveBeenCalled();
  });

  it("refuses a form that carries no title field and keeps the stored title", async () => {
    const result = await runUpdateAction(null);

    expectTitleRequired(result);
    expect(updateIssue).not.toHaveBeenCalled();
  });

  it("stores the title with its leading and trailing spaces trimmed", async () => {
    const result = (await runUpdateAction("  Trimmed title check  ")) as Response;

    expect(updateIssue).toHaveBeenCalledTimes(1);
    expect(vi.mocked(updateIssue).mock.calls[0][0]).toMatchObject({
      id: "i1",
      name: "Trimmed title check",
    });
    expect(result.status).toBe(302);
    expect(result.headers.get("Location")).toBe("/projects/p1/board");
  });
});

describe("creating an issue title", () => {
  beforeEach(() => {
    vi.mocked(createIssue).mockClear();
  });

  it("refuses a title that is only spaces and creates nothing", async () => {
    const result = await runCreateAction("   ");

    expectTitleRequired(result);
    expect(createIssue).not.toHaveBeenCalled();
  });

  it("refuses a form that carries no title field and creates nothing", async () => {
    const result = await runCreateAction(null);

    expectTitleRequired(result);
    expect(createIssue).not.toHaveBeenCalled();
  });

  it("creates the issue with the title's leading and trailing spaces trimmed", async () => {
    const result = (await runCreateAction("  Trimmed title check  ")) as Response;

    expect(createIssue).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createIssue).mock.calls[0][0]).toMatchObject({
      name: "Trimmed title check",
    });
    expect(result.status).toBe(302);
    expect(result.headers.get("Location")).toBe("/projects/p1/board");
  });
});
