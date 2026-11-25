import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Comment } from "@domain/comment";
import { Issue, todoIssuesMock1 } from "@domain/issue";
import { projectMock1 } from "@domain/project";
import { userMock1 } from "@domain/user";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";

const COMMENT_PLACEHOLDER = "Add your comment...";

// jsdom ships no matchMedia, which the panel's theme provider reads on mount
vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
  addListener: () => undefined,
  removeListener: () => undefined,
  dispatchEvent: () => false,
}));

const renderIssuePanel = (issue: Issue = todoIssuesMock1[0]) =>
  render(
    <ProjectContextProvider project={projectMock1}>
      {withRemixStub(withMainContext(() => <IssuePanel issue={issue} />))}
    </ProjectContextProvider>
  );

// The panel holds a textarea per editable field, so a comment box is found by its
// own placeholder, scoped to the comment it belongs to when there is more than one.
const getCommentBox = (scope: HTMLElement) => {
  const textarea = within(scope).getByPlaceholderText(
    COMMENT_PLACEHOLDER
  ) as HTMLTextAreaElement;
  const save = within(scope).getByRole("button", {
    name: "Save comment",
  }) as HTMLButtonElement;

  return { textarea, save };
};

const getPostedCommentTexts = (text: string) =>
  screen
    .getAllByText((content) => content.includes(text))
    .map((element) => element.textContent);

describe("IssuePanel comment box", () => {
  it("keeps the save button disabled, and posts nothing, while the field holds nothing but whitespace", async () => {
    const user = userEvent.setup();
    renderIssuePanel({ ...todoIssuesMock1[0], comments: [] });

    const { textarea, save } = getCommentBox(document.body);

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(save.disabled).toBe(true);

    await user.type(textarea, "   ");
    expect(textarea.value).toBe("   ");
    expect(save.disabled).toBe(true);

    fireEvent.change(textarea, { target: { value: " \t\n " } });
    expect(textarea.value).toBe(" \t\n ");
    expect(save.disabled).toBe(true);

    // The disabled button is what stops the empty comment; nothing behind it
    // may post one either, and the box shows no error state for it.
    fireEvent.click(save);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(textarea.placeholder).toBe(COMMENT_PLACEHOLDER);

    await user.clear(textarea);
    await user.type(textarea, "R");
    expect(save.disabled).toBe(false);
  });

  it("posts a new comment without its surrounding whitespace and clears the box back to disabled", async () => {
    const user = userEvent.setup();
    renderIssuePanel();

    const { textarea, save } = getCommentBox(document.body);

    await user.type(textarea, "  Trimmed comment  ");
    await user.click(save);

    expect(getPostedCommentTexts("Trimmed comment")).toEqual([
      "Trimmed comment",
    ]);

    expect(textarea.value).toBe("");
    expect(save.disabled).toBe(true);
  });

  it("refuses a whitespace-only edit of an existing comment, and trims the text it does save", async () => {
    const user = userEvent.setup();
    const comment: Comment = {
      id: "comment-1",
      user: userMock1,
      message: "Existing comment",
      createdAt: todoIssuesMock1[0].createdAt,
      updatedAt: todoIssuesMock1[0].createdAt,
    };
    renderIssuePanel({ ...todoIssuesMock1[0], comments: [comment] });

    const commentItem = screen.getByRole("listitem");
    await user.click(
      within(commentItem).getByRole("button", { name: "Edit comment" })
    );

    const { textarea, save } = getCommentBox(commentItem);
    expect(textarea.value).toBe("Existing comment");

    await user.clear(textarea);
    await user.type(textarea, "   ");
    expect(save.disabled).toBe(true);

    fireEvent.click(save);
    // The edit was refused, so the comment is still open in its box
    expect(
      within(commentItem).queryByPlaceholderText(COMMENT_PLACEHOLDER)
    ).not.toBeNull();

    await user.clear(textarea);
    await user.type(textarea, "  Updated comment  ");
    await user.click(save);

    expect(getPostedCommentTexts("Updated comment")).toEqual([
      "Updated comment",
    ]);
  });
});
