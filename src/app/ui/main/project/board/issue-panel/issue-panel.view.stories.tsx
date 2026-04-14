import type { Meta, StoryObj } from "@storybook/react";
import { todoIssuesMock1 } from "@domain/issue";
import { projectMock1 } from "@domain/project";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Board/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

const RenderWithContexts = (issue: typeof todoIssuesMock1[0] | undefined) => (
  <UserContextProvider user={userMock1}>
    <ThemeProvider
      specifiedTheme={Theme.LIGHT}
      specifiedPreference={Preference.SELECTED}
    >
      <div className="w-full">
        <ProjectContextProvider project={projectMock1}>
          <IssuePanel issue={issue} />
        </ProjectContextProvider>
      </div>
    </ThemeProvider>
  </UserContextProvider>
);

const withRemixStubForIssuePanel = (issue: typeof todoIssuesMock1[0] | undefined) => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      element: RenderWithContexts(issue),
      action: async () => {
        return {
          status: 200,
        };
      },
    },
  ]);

  return <RemixStub />;
};

export const Default: Story = {
  render: () => withRemixStubForIssuePanel(todoIssuesMock1[0]),
};

export const Empty: Story = {
  render: () => withRemixStubForIssuePanel(undefined),
};
