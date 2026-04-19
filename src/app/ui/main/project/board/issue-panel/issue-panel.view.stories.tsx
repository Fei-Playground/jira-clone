import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { projectMock1 } from "@domain/project";
import { userMock1, usersMock } from "@domain/user";
import { todoIssuesMock1, inProgressIssuesMock1 } from "@domain/issue";
import { ProjectContextProvider } from "@app/ui/main/project";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { IssuePanel } from "./issue-panel.view";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story, context) => {
      // Use different users based on story variant
      const currentUser = context.name === "WithReplies" ? usersMock[3] : userMock1; // Jessie for WithReplies, Daniel Serrano for others

      const WrappedStory = (
        <ProjectContextProvider project={projectMock1}>
          <Story />
        </ProjectContextProvider>
      );

      const WithContext = (
        <UserContextProvider user={currentUser}>
          <ThemeProvider
            specifiedTheme={Theme.LIGHT}
            specifiedPreference={Preference.SELECTED}
          >
            <div className="w-full">{WrappedStory}</div>
          </ThemeProvider>
        </UserContextProvider>
      );

      const RemixStub = createRemixStub([
        {
          path: "/",
          element: WithContext,
          action: async () => {
            return {
              status: 200,
            };
          },
        },
      ]);

      return <RemixStub />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

export const Default: Story = {
  args: {
    issue: todoIssuesMock1[0],
  },
};

export const Empty: Story = {
  args: {
    issue: undefined,
  },
};

export const WithReplies: Story = {
  args: {
    issue: inProgressIssuesMock1[1],
  },
};
