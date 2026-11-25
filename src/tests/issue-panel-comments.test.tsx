import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { userMock1 } from "@domain/user";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { withRemixStub } from "@app/stories/utils";
import { UserContextProvider } from "@app/store/user.store";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "@app/ui/main/project/board/issue-panel";

const issue = todoIssuesMock1[0];

const renderPanel = () => {
  const Panel = () => (
    <UserContextProvider user={userMock1}>
      <IssuePanel issue={issue} />
    </UserContextProvider>
  );

  return render(
    <ProjectContextProvider project={projectMock1}>
      {withRemixStub(<Panel />)}
    </ProjectContextProvider>
  );
};

describe("issue panel comments", () => {
  it("keeps the comment box's Save button disabled while the message holds only whitespace, and adds no comment when it is clicked", async () => {
    const user = userEvent.setup();
    renderPanel();
    const box = screen.getByPlaceholderText("Add your comment...");
    const save = screen.getByLabelText("Save comment");
    const commentsBefore = screen.getAllByRole("listitem").length;

    expect(save).toBeDisabled();

    for (const whitespaceOnly of ["   ", "\t", "\n"]) {
      await user.clear(box);
      await user.type(box, whitespaceOnly);

      expect(box).toHaveValue(whitespaceOnly);
      expect(save).toBeDisabled();
    }

    await user.click(save);

    expect(screen.getAllByRole("listitem")).toHaveLength(commentsBefore);
  });

  it("enables the Save button once the message holds real text and adds the comment without its surrounding whitespace", async () => {
    const user = userEvent.setup();
    renderPanel();
    const box = screen.getByPlaceholderText("Add your comment...");
    const save = screen.getByLabelText("Save comment");
    const commentsBefore = screen.getAllByRole("listitem").length;

    await user.type(box, "a");
    expect(save).toBeEnabled();

    await user.clear(box);
    await user.type(box, "   Studio check   ");
    expect(save).toBeEnabled();

    await user.click(save);

    expect(screen.getAllByRole("listitem")).toHaveLength(commentsBefore + 1);
    expect(screen.getByText("Studio check").textContent).toBe("Studio check");
  });
});
