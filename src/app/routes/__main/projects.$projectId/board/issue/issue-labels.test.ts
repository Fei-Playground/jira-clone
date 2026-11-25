import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs } from "react-router";
import { userMock1 } from "@domain/user";

const db = vi.hoisted(() => ({
  getIssue: vi.fn(),
  createIssue: vi.fn(),
  updateIssue: vi.fn(),
  deleteIssue: vi.fn(),
}));

vi.mock("@infrastructure/db/issue", () => db);

import { action as updateIssueAction } from "./$issueId";
import { action as createIssueAction } from "./new";

const params = { projectId: "jira-clone", issueId: "issue-id" };

const formDataOf = ({ _action, labels }: { _action: string; labels?: string | null }): FormData => {
  const formData = new FormData();
  formData.set("_action", _action);
  formData.set("title", "Issue name");
  formData.set("description", "");
  formData.set("status", "category-id");
  formData.set("priority", "low");
  formData.set("asignee", userMock1.id);
  formData.set("reporter", userMock1.id);
  formData.set("comments", "[]");
  if (labels !== null && labels !== undefined) formData.set("labels", labels);
  return formData;
};

const callAction = (action: typeof updateIssueAction, formData: FormData) =>
  action({
    request: new Request("http://localhost/projects/jira-clone/board/issue/issue-id", {
      method: "POST",
      body: formData,
    }),
    params,
  } as unknown as ActionFunctionArgs);

describe("the issue route actions", () => {
  beforeEach(() => {
    db.getIssue.mockReset();
    db.createIssue.mockReset().mockResolvedValue("new-issue-id");
    db.updateIssue.mockReset().mockResolvedValue(undefined);
    db.deleteIssue.mockReset().mockResolvedValue(undefined);
  });

  it("saves the labels of an updated issue trimmed, without the empty ones and without duplicates", async () => {
    await callAction(
      updateIssueAction,
      formDataOf({
        _action: "update",
        labels: JSON.stringify(["  bug  ", "bug", "   ", "ui"]),
      })
    );

    expect(db.updateIssue).toHaveBeenCalledTimes(1);
    expect(db.updateIssue.mock.calls[0][0]).toMatchObject({
      id: "issue-id",
      labels: ["bug", "ui"],
    });
  });

  it("saves no labels when the update posts none or posts a malformed one", async () => {
    await callAction(updateIssueAction, formDataOf({ _action: "update", labels: null }));
    await callAction(updateIssueAction, formDataOf({ _action: "update", labels: "[not json" }));

    expect(db.updateIssue).toHaveBeenCalledTimes(2);
    expect(db.updateIssue.mock.calls[0][0]).toMatchObject({ labels: [] });
    expect(db.updateIssue.mock.calls[1][0]).toMatchObject({ labels: [] });
  });

  it("saves the labels of a created issue trimmed, without the empty ones and without duplicates", async () => {
    await callAction(
      createIssueAction,
      formDataOf({
        _action: "create",
        labels: JSON.stringify(["  bug  ", "bug", "   ", "ui"]),
      })
    );

    expect(db.createIssue).toHaveBeenCalledTimes(1);
    expect(db.createIssue.mock.calls[0][0]).toMatchObject({
      labels: ["bug", "ui"],
    });
  });

  it("saves no labels when the creation posts none", async () => {
    await callAction(createIssueAction, formDataOf({ _action: "create", labels: null }));

    expect(db.createIssue).toHaveBeenCalledTimes(1);
    expect(db.createIssue.mock.calls[0][0]).toMatchObject({ labels: [] });
  });
});
