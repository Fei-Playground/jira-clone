import type { Meta, StoryObj } from "@storybook/react-vite";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { IssuePanel } from "./issue-panel.view";
import { todoIssuesMock1 } from "@domain/issue";
import { projectMock1 } from "@domain/project";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import {
  ThemeProvider,
  Theme,
  Preference,
} from "@app/store/theme.store";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";

const meta: Meta<typeof IssuePanel> = {
  title: "Components/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

// Helper to create Remix stub with context
const createStoryComponent = (issue: any) => {
  const InnerComponent = () => (
    <UserContextProvider user={userMock1}>
      <ThemeProvider
        specifiedTheme={Theme.LIGHT}
        specifiedPreference={Preference.SELECTED}
      >
        <ProjectContextProvider project={projectMock1}>
          <IssuePanel issue={issue} />
        </ProjectContextProvider>
      </ThemeProvider>
    </UserContextProvider>
  );

  const RemixStub = createRemixStub([
    {
      path: "/",
      element: <InnerComponent />,
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
  render: () => createStoryComponent(todoIssuesMock1[0]),
};

export const Empty: Story = {
  render: () => createStoryComponent(undefined),
};
