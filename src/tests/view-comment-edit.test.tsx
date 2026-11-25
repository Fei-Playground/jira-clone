import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { commentMock4 } from "@domain/comment";
import { userMock1 } from "@domain/user";
import { withRemixStub } from "@app/stories/utils";
import { UserContextProvider } from "@app/store/user.store";
import { ViewComment } from "@app/ui/main/project/board/issue-panel/comment/view-comment";

const renderComment = () => {
  const CommentView = () => (
    <UserContextProvider user={userMock1}>
      <ViewComment comment={commentMock4} removeComment={() => undefined} />
    </UserContextProvider>
  );

  return render(withRemixStub(<CommentView />));
};

describe("editing an existing comment", () => {
  it("keeps the Save button enabled for the comment's own text, refuses a whitespace-only edit and trims a saved edit", async () => {
    const user = userEvent.setup();
    renderComment();

    await user.click(screen.getByLabelText("Edit comment"));

    const box = screen.getByPlaceholderText("Add your comment...");
    const save = screen.getByLabelText("Save comment");

    expect(box).toHaveValue(commentMock4.message);
    expect(save).toBeEnabled();

    await user.clear(box);
    await user.type(box, "   ");
    expect(save).toBeDisabled();

    await user.click(save);
    expect(
      screen.getByPlaceholderText("Add your comment...")
    ).toBeInTheDocument();

    await user.clear(box);
    await user.type(box, "   Studio check   ");
    expect(save).toBeEnabled();

    await user.click(save);

    expect(screen.getByText("Studio check").textContent).toBe("Studio check");
  });
});
