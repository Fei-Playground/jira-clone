import type { Meta, StoryObj } from "@storybook/react-vite";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { IssuePanel } from "./issue-panel.view";
import { ProjectContextProvider } from "../../project.store";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { projectMock1 } from "@domain/project";
import { userMock1 } from "@domain/user";
import { todoIssuesMock1, inProgressIssuesMock1 } from "@domain/issue";

const meta: Meta<typeof IssuePanel> = {
  title: "Project/Board/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      const WrappedStory = () => (
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
      );

      const RemixStub = createRemixStub([
        {
          path: "/",
          element: <WrappedStory />,
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

export const WithAttachments: Story = {
  args: {
    // inProgressIssuesMock1[1] has comments with attachments
    issue: inProgressIssuesMock1[1],
  },
};
