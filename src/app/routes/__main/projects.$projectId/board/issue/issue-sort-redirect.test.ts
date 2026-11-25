// @vitest-environment node
import "../test-db";
import { describe, expect, it } from "vitest";
import type { Category } from "@domain/category";
import type { Issue } from "@domain/issue";
import type { Project } from "@domain/project";
import { getIssue } from "@infrastructure/db/issue";
import { loader as boardLoader } from "../../board";
import { action as createIssueAction } from "./new";
import { action as editIssueAction } from "./$issueId";

const PROJECT_ID = "second-project";
const ISSUE_NAME = "Add and display issue timestamps";

/** The TODO column of `second-project`, in the order the priority sort puts it. */
const PRIORITY_ORDER = [
  ISSUE_NAME,
  "Add projects section and the ability to create multiple projects",
];

const boardUrl = (search: string): string =>
  `http://localhost/projects/${PROJECT_ID}/board${search}`;

const editIssueUrl = (issueId: string, search: string): string =>
  `http://localhost/projects/${PROJECT_ID}/board/issue/${issueId}${search}`;

const createIssueUrl = (search: string): string =>
  `http://localhost/projects/${PROJECT_ID}/board/issue/new${search}`;

type RouteArgs = { request: Request; params: Record<string, string> };
type RouteAction = (args: RouteArgs) => Promise<Response>;
type BoardLoader = (args: RouteArgs) => Promise<{ data: { project: Project } }>;

const loadBoard = async (search: string): Promise<Project> => {
  const result = await (boardLoader as unknown as BoardLoader)({
    request: new Request(boardUrl(search)),
    params: { projectId: PROJECT_ID },
  });

  return result.data.project;
};

const findCategory = (project: Project, type: Category["type"]): Category => {
  const category = project.categories.find((candidate) => candidate.type === type);

  if (!category) throw new Error(`Seeded category not found: ${type}`);

  return category;
};

const findIssue = (category: Category, name: string): Issue => {
  const issue = category.issues.find((candidate) => candidate.name === name);

  if (!issue) throw new Error(`Seeded issue not found: ${name}`);

  return issue;
};

/** Saves the issue as it already is, so the board order stays put. */
const editFormData = (issue: Issue, categoryId: string): FormData => {
  const formData = new FormData();

  formData.set("_action", "update");
  formData.set("title", issue.name);
  formData.set("description", issue.description ?? "");
  formData.set("status", categoryId);
  formData.set("priority", issue.priority.id);
  formData.set("asignee", issue.asignee?.id ?? issue.reporter.id);
  formData.set("reporter", issue.reporter.id);
  formData.set("comments", JSON.stringify(issue.comments));

  return formData;
};

const createFormData = (categoryId: string, userId: string): FormData => {
  const formData = new FormData();

  formData.set("_action", "create");
  formData.set("title", "Issue created from a board URL that carries a sort");
  formData.set("description", "");
  formData.set("status", categoryId);
  formData.set("priority", "low");
  formData.set("asignee", userId);
  formData.set("reporter", userId);
  formData.set("comments", "[]");

  return formData;
};

const editIssueFromBoard = async (search: string): Promise<Response> => {
  const todo = findCategory(await loadBoard("?sortBy=priority"), "TODO");
  const issueId = findIssue(todo, ISSUE_NAME).id;
  const issue = await getIssue(issueId);

  if (!issue) throw new Error(`Seeded issue not found: ${ISSUE_NAME}`);

  return (editIssueAction as unknown as RouteAction)({
    request: new Request(editIssueUrl(issueId, search), {
      method: "POST",
      body: editFormData(issue, todo.id),
    }),
    params: { projectId: PROJECT_ID, issueId },
  });
};

/** Creates in the DONE column, so the TODO order this file asserts stays put. */
const createIssueFromBoard = async (search: string): Promise<Response> => {
  const project = await loadBoard("?sortBy=priority");
  const done = findCategory(project, "DONE");

  return (createIssueAction as unknown as RouteAction)({
    request: new Request(createIssueUrl(search), {
      method: "POST",
      body: createFormData(done.id, project.users[0].id),
    }),
    params: { projectId: PROJECT_ID },
  });
};

describe("issue routes: the sort carried into the redirect", () => {
  it("edits an issue from ?sortBy=PRIORITY and lands on the board with the canonical sort", async () => {
    const response = await editIssueFromBoard("?sortBy=PRIORITY");

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(`/projects/${PROJECT_ID}/board?sortBy=priority`);

    const todo = findCategory(await loadBoard("?sortBy=priority"), "TODO");
    expect(todo.issues.map((issue) => issue.name)).toEqual(PRIORITY_ORDER);
  });

  it("creates an issue from ?sortBy=PRIORITY and lands on the board with the canonical sort", async () => {
    const response = await createIssueFromBoard("?sortBy=PRIORITY");

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(`/projects/${PROJECT_ID}/board?sortBy=priority`);
  });

  it.each([
    { search: "?sortBy=bogus", why: "a value that is not a sort" },
    { search: "?sortBy=PRIORITIES", why: "a plural that is not a sort" },
    { search: "?sortBy=NAME", why: "an upper case value that is not a sort" },
    { search: "?sortBy=", why: "an empty value" },
    { search: "", why: "no sortBy param at all" },
  ])("drops $search from the redirect ($why)", async ({ search }) => {
    expect((await editIssueFromBoard(search)).headers.get("Location")).toBe(
      `/projects/${PROJECT_ID}/board`
    );
    expect((await createIssueFromBoard(search)).headers.get("Location")).toBe(
      `/projects/${PROJECT_ID}/board`
    );
  });
});
