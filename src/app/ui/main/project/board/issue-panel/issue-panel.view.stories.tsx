import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";
import { Theme, Preference } from "@app/store/theme.store";
import { ThemeProvider } from "@app/store/theme.store";
import { UserContextProvider } from "@app/store/user.store";
import { userMock1 } from "@domain/user";
import "react-toastify/dist/ReactToastify.css";

// Helper function to create a RemixStub with proper action handling
const createRemixStubWrapper = (children: JSX.Element) => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      element: children,
      action: async () => {
        return { status: 200 };
      },
    },
  ]);
  return <RemixStub />;
};

// Light theme wrapper
const withLightTheme = (Story: any) => (
  <UserContextProvider user={userMock1}>
    <ThemeProvider
      specifiedTheme={Theme.LIGHT}
      specifiedPreference={Preference.SELECTED}
    >
      <div className="light w-full h-full bg-elevation-surface">
        <ProjectContextProvider project={projectMock1}>
          <Story />
        </ProjectContextProvider>
      </div>
    </ThemeProvider>
  </UserContextProvider>
);

// Dark theme wrapper
const withDarkTheme = (Story: any) => (
  <UserContextProvider user={userMock1}>
    <ThemeProvider
      specifiedTheme={Theme.DARK}
      specifiedPreference={Preference.SELECTED}
    >
      <div className="dark w-full h-full bg-elevation-surface">
        <ProjectContextProvider project={projectMock1}>
          <Story />
        </ProjectContextProvider>
      </div>
    </ThemeProvider>
  </UserContextProvider>
);

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

export const Default: Story = {
  args: {
    issue: issue,
  },
  decorators: [
    (Story) => createRemixStubWrapper(withLightTheme(Story)),
  ],
};

export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: issue.comments,
    },
  },
  decorators: [
    (Story) => createRemixStubWrapper(withLightTheme(Story)),
  ],
};

export const Dark: Story = {
  args: {
    issue: issue,
  },
  decorators: [
    (Story) => createRemixStubWrapper(withDarkTheme(Story)),
  ],
};

export const DarkWithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: issue.comments,
    },
  },
  decorators: [
    (Story) => createRemixStubWrapper(withDarkTheme(Story)),
  ],
};
