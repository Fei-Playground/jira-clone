import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { IssuePanel } from "./issue-panel.view";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Project/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: "/",
          element: (
            <UserContextProvider user={userMock1}>
              <ThemeProvider
                specifiedTheme={Theme.LIGHT}
                specifiedPreference={Preference.SELECTED}
              >
                <ProjectContextProvider project={projectMock1}>
                  <Story />
                </ProjectContextProvider>
              </ThemeProvider>
            </UserContextProvider>
          ),
          action: async () => {
            return { status: 200 };
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
