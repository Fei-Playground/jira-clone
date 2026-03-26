import type { Meta, StoryObj } from "@storybook/react";
import { withRemixStub, withMainContext } from "@app/stories/utils";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";
import { IssuePanel } from "./issue-panel.view";
import { todoIssuesMock1 } from "@domain/issue";
import { projectMock1 } from "@domain/project";

const meta: Meta<typeof IssuePanel> = {
  title: "Project/Board/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      const WrappedStory = () => (
        <ProjectContextProvider project={projectMock1}>
          <Story />
        </ProjectContextProvider>
      );
      return withRemixStub(withMainContext(WrappedStory));
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
