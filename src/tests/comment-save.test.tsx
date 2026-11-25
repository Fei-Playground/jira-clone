import type { ReactElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { userMock1 } from "@domain/user";
import { commentMock4 } from "@domain/comment";
import { todoIssuesMock1 } from "@domain/issue";
import { projectMock1 } from "@domain/project";
import { withRemixStub } from "@app/stories/utils";
import { UserContextProvider } from "@app/store/user.store";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "@app/ui/main/project/board/issue-panel";
import { EditBox } from "@app/ui/main/project/board/issue-panel/comment/edit-box";
import { CreateComment } from "@app/ui/main/project/board/issue-panel/comment/create-comment";
import { ViewComment } from "@app/ui/main/project/board/issue-panel/comment/view-comment";

const renderAsLoggedInUser = (ui: ReactElement) =>
  render(
    withRemixStub(
      <UserContextProvider user={userMock1}>{ui}</UserContextProvider>
    )
  );

const getCommentBox = (): HTMLTextAreaElement =>
  screen.getByPlaceholderText("Add your comment...") as HTMLTextAreaElement;

const getSaveButton = (): HTMLButtonElement =>
  screen.getByRole("button", { name: "Save comment" }) as HTMLButtonElement;

describe("comment save", () => {
  it("keeps the save button disabled until the message has non-whitespace content", async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    const cancel = vi.fn();
    render(<EditBox defaultMessage="" save={save} cancel={cancel} />);

    const box = getCommentBox();
    const saveButton = getSaveButton();

    expect(saveButton.disabled).toBe(true);
    expect(saveButton.getAttribute("title")).toBe("Write a comment to save it");
    fireEvent.click(saveButton);
    expect(save).not.toHaveBeenCalled();

    for (const onlyWhitespace of [" ", "   ", "\t", "\n", " \t\n  "]) {
      fireEvent.change(box, { target: { value: onlyWhitespace } });
      expect(box.value).toBe(onlyWhitespace);
      expect(saveButton.disabled).toBe(true);
      fireEvent.click(saveButton);
      expect(save).not.toHaveBeenCalled();
    }

    fireEvent.change(box, { target: { value: "   hello   " } });
    expect(saveButton.disabled).toBe(false);
    expect(saveButton.getAttribute("title")).toBeNull();
    await user.click(saveButton);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith("hello");
    expect(box.value).toBe("");

    fireEvent.change(box, { target: { value: "a" } });
    expect(saveButton.disabled).toBe(false);
    await user.click(saveButton);
    expect(save).toHaveBeenCalledTimes(2);
    expect(save).toHaveBeenLastCalledWith("a");

    fireEvent.change(box, { target: { value: "  discarded  " } });
    await user.click(screen.getByRole("button", { name: "Cancel comment" }));
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledTimes(2);
    expect(box.value).toBe("");
  });

  it("adds a comment through the create box with the message trimmed", async () => {
    const user = userEvent.setup();
    const addComment = vi.fn();
    renderAsLoggedInUser(<CreateComment addComment={addComment} />);

    const box = getCommentBox();
    const saveButton = getSaveButton();

    fireEvent.change(box, { target: { value: " \t\n " } });
    expect(saveButton.disabled).toBe(true);
    fireEvent.click(saveButton);
    expect(addComment).not.toHaveBeenCalled();

    fireEvent.change(box, { target: { value: "  hello  " } });
    expect(saveButton.disabled).toBe(false);
    await user.click(saveButton);

    expect(addComment).toHaveBeenCalledTimes(1);
    expect(addComment).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(/^temp-/),
        user: userMock1,
        message: "hello",
      })
    );
  });

  it("trims the message when an existing comment is edited", async () => {
    const user = userEvent.setup();
    renderAsLoggedInUser(
      <ViewComment comment={commentMock4} removeComment={vi.fn()} />
    );

    expect(screen.getByText(commentMock4.message).textContent).toBe(
      commentMock4.message
    );

    await user.click(screen.getByRole("button", { name: "Edit comment" }));
    const box = getCommentBox();
    expect(box.value).toBe(commentMock4.message);

    fireEvent.change(box, { target: { value: "   " } });
    expect(getSaveButton().disabled).toBe(true);
    fireEvent.click(getSaveButton());
    await user.click(screen.getByRole("button", { name: "Cancel comment" }));
    expect(screen.getByText(commentMock4.message).textContent).toBe(
      commentMock4.message
    );

    await user.click(screen.getByRole("button", { name: "Edit comment" }));
    fireEvent.change(getCommentBox(), {
      target: { value: "   trimmed comment   " },
    });
    expect(getSaveButton().disabled).toBe(false);
    await user.click(getSaveButton());

    expect(screen.getByText(/trimmed comment/).textContent).toBe(
      "trimmed comment"
    );
  });

  it("shows the saved comment in the issue panel's comment list", async () => {
    const user = userEvent.setup();
    render(
      withRemixStub(
        <UserContextProvider user={userMock1}>
          <ProjectContextProvider project={projectMock1}>
            <IssuePanel issue={{ ...todoIssuesMock1[0], comments: [] }} />
          </ProjectContextProvider>
        </UserContextProvider>
      )
    );

    const box = await screen.findByPlaceholderText("Add your comment...");
    const saveButton = getSaveButton();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);

    fireEvent.change(box, { target: { value: "   " } });
    expect(saveButton.disabled).toBe(true);
    fireEvent.click(saveButton);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);

    fireEvent.change(box, { target: { value: "  hello from the panel  " } });
    expect(saveButton.disabled).toBe(false);
    await user.click(saveButton);

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText(/hello from the panel/).textContent).toBe(
      "hello from the panel"
    );
  });
});
