import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { ProjectContextProvider } from "../../project.store";
import { IssuePanel } from "./issue-panel.view";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel",
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
    (Story, context) => {
      const WrappedStory = () => (
        <ProjectContextProvider project={projectMock1}>
          <Story />
        </ProjectContextProvider>
      );
      return withRemixStub(withMainContext(WrappedStory));
    },
  ],
};

export const Empty: Story = {
  args: {
    issue: undefined,
  },
  decorators: [
    (Story, context) => {
      const WrappedStory = () => (
        <ProjectContextProvider project={projectMock1}>
          <Story />
        </ProjectContextProvider>
      );
      return withRemixStub(withMainContext(WrappedStory));
    },
  ],
};
