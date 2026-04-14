import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { ProjectContextProvider } from "@app/ui/main/project";
import { userMock1 } from "@domain/user";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { IssuePanel } from "./issue-panel.view";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Project/Board/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

/**
 * Wrapper component that provides all required context providers for stories
 */
const StoryWrapper = ({ children }: { children: JSX.Element }): JSX.Element => (
  <UserContextProvider user={userMock1}>
    <ThemeProvider
      specifiedTheme={Theme.LIGHT}
      specifiedPreference={Preference.SELECTED}
    >
      <ProjectContextProvider project={projectMock1}>
        {children}
      </ProjectContextProvider>
    </ThemeProvider>
  </UserContextProvider>
);

export const Default: Story = {
  render: () => {
    const issue = todoIssuesMock1[0];

    const RemixStub = createRemixStub([
      {
        path: "/",
        element: (
          <StoryWrapper>
            <IssuePanel issue={issue} />
          </StoryWrapper>
        ),
        action: async () => {
          return {
            status: 200,
          };
        },
      },
    ]);

    return <RemixStub />;
  },
};

export const Empty: Story = {
  render: () => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        element: (
          <StoryWrapper>
            <IssuePanel />
          </StoryWrapper>
        ),
        action: async () => {
          return {
            status: 200,
          };
        },
      },
    ]);

    return <RemixStub />;
  },
};
