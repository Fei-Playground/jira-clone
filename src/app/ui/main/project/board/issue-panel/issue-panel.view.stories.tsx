import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { IssuePanel } from "./issue-panel.view";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";
import { UserContextProvider } from "@app/store/user.store";
import { projectMock1 } from "@domain/project/project.mock";
import { todoIssuesMock1 } from "@domain/issue/issue.mock";
import { userMock1 } from "@domain/user/user.mock";

const meta: Meta<typeof IssuePanel> = {
  title: "Project/Board/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

export const Default: Story = {
  args: {
    issue: todoIssuesMock1[0],
  },
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: "/",
          element: (
            <ProjectContextProvider project={projectMock1}>
              <UserContextProvider user={userMock1}>
                <Story />
              </UserContextProvider>
            </ProjectContextProvider>
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
  ],
};

export const Empty: Story = {
  args: {
    issue: undefined,
  },
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: "/",
          element: (
            <ProjectContextProvider project={projectMock1}>
              <UserContextProvider user={userMock1}>
                <Story />
              </UserContextProvider>
            </ProjectContextProvider>
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
  ],
};
