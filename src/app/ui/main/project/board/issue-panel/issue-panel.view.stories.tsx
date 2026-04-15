import type { Meta, StoryObj } from "@storybook/react-vite";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { ProjectContextProvider } from "@app/ui/main/project";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { userMock1 } from "@domain/user";
import { IssuePanel } from "./issue-panel.view";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel/IssuePanelView",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

const issue = todoIssuesMock1[0];

// Helper to create decorator with theme
const createDecorator = (theme: Theme) => {
  return (Story: React.ComponentType) => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        element: (
          <UserContextProvider user={userMock1}>
            <ThemeProvider specifiedTheme={theme} specifiedPreference={Preference.SELECTED}>
              <ProjectContextProvider project={projectMock1}>
                <div className={theme === Theme.DARK ? "dark" : "light"}>
                  <Story />
                </div>
              </ProjectContextProvider>
            </ThemeProvider>
          </UserContextProvider>
        ),
        action: async () => ({ status: 200 }),
      },
    ]);
    return <RemixStub />;
  };
};

export const Default: Story = {
  args: {
    issue: issue,
  },
  decorators: [createDecorator(Theme.LIGHT)],
};

export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: issue.comments,
    },
  },
  decorators: [createDecorator(Theme.LIGHT)],
};

export const Dark: Story = {
  args: {
    issue: issue,
  },
  decorators: [createDecorator(Theme.DARK)],
};

export const DarkWithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: issue.comments,
    },
  },
  decorators: [createDecorator(Theme.DARK)],
};
