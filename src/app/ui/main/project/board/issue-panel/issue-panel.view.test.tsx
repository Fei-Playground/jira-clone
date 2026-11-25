import { expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, data as json } from "react-router";
import { ProjectContextProvider } from "@app/ui/main/project";
import { UserContextProvider } from "@app/store/user.store";
import { projectMock1 } from "@domain/project";
import { userMock1 } from "@domain/user";
import { IssuePanel } from "./issue-panel.view";

/**
 * Renders the create-issue panel (the same panel with no issue to edit) whose
 * action refuses the title, which is what the panel shows the message for.
 */
const renderCreateIssuePanel = () => {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => <IssuePanel />,
      action: () =>
        json({ errors: { name: "Title is required" } }, { status: 400 }),
    },
  ]);

  return render(
    <ProjectContextProvider project={projectMock1}>
      <UserContextProvider user={userMock1}>
        <Stub />
      </UserContextProvider>
    </ProjectContextProvider>
  );
};

it("shows the title error on a refused save and clears it once the title is fixed", async () => {
  const user = userEvent.setup();
  renderCreateIssuePanel();

  const titleField =
    screen.getByPlaceholderText<HTMLTextAreaElement>("Write the title");
  expect(screen.queryByText("Title is required")).toBeNull();

  await user.type(titleField, "   ");
  expect(titleField.value).toBe("   ");

  await user.click(screen.getByRole("button", { name: "Accept changes" }));
  expect(await screen.findByText("Title is required")).toBeTruthy();

  await user.clear(titleField);
  await user.type(titleField, "Fixed title");

  await waitFor(() =>
    expect(screen.queryByText("Title is required")).toBeNull()
  );
});
