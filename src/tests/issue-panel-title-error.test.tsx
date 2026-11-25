import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, data as json } from "react-router";
import { userMock1 } from "@domain/user";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1, Issue } from "@domain/issue";
import { UserContextProvider } from "@app/store/user.store";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "@app/ui/main/project/board/issue-panel";

const TITLE_REQUIRED = "Title is required";
const TITLE_PLACEHOLDER = "Write the title";
const DANGER_OUTLINE = "outline-border-danger";

type PanelAction = Parameters<typeof createRoutesStub>[0][number]["action"];

const renderPanel = (issue: Issue | undefined, action: PanelAction) => {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <UserContextProvider user={userMock1}>
          <ProjectContextProvider project={projectMock1}>
            <IssuePanel issue={issue} />
          </ProjectContextProvider>
        </UserContextProvider>
      ),
      action,
    },
  ]);

  return render(<Stub />);
};

const openPanel = async () => {
  const user = userEvent.setup();
  const field = await screen.findByPlaceholderText(TITLE_PLACEHOLDER);

  return { user, field };
};

const acceptChanges = async (
  user: ReturnType<typeof userEvent.setup>,
  title: string,
  field: HTMLElement
) => {
  await user.clear(field);
  await user.type(field, title);
  await user.click(screen.getByRole("button", { name: "Accept changes" }));
};

test("a refused title shows the message on the title field and keeps the panel open", async () => {
  renderPanel(undefined, async () =>
    json({ errors: { name: TITLE_REQUIRED } }, { status: 400 })
  );

  const { user, field } = await openPanel();

  // Nothing is wrong with the field until the server refuses the title.
  expect(field.className).not.toContain(DANGER_OUTLINE);

  await acceptChanges(user, "   ", field);

  expect(await screen.findByText(TITLE_REQUIRED)).not.toBeNull();
  expect(field.className).toContain(DANGER_OUTLINE);
  expect(screen.getByRole("button", { name: "Accept changes" })).not.toBeNull();

  // The message belongs to the refusal, not to every render: typing a real
  // title takes both the message and the outline away.
  await user.type(field, "Now a real title");
  expect(screen.queryByText(TITLE_REQUIRED)).toBeNull();
  expect(field.className).not.toContain(DANGER_OUTLINE);
});

test("an accepted title leaves the panel without a refusal message", async () => {
  renderPanel(todoIssuesMock1[0], async () => json({ ok: true }));

  const { user, field } = await openPanel();

  await acceptChanges(user, "Trimmed on save", field);

  expect(field).not.toBeNull();
  expect(screen.queryByText(TITLE_REQUIRED)).toBeNull();
  expect(field.className).not.toContain(DANGER_OUTLINE);
  expect(screen.getByRole("button", { name: "Accept changes" })).not.toBeNull();
});
