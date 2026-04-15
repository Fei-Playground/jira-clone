import type { Meta, StoryObj } from "@storybook/react";
import { IssuePanel } from "./issue-panel.view";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ProjectContextProvider } from "../../project.store";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";

const meta: Meta<typeof IssuePanel> = {
  title: "UI/Project/Board/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

const WrappedStory = ({ issue }: { issue?: typeof todoIssuesMock1[0] }) => (
  <ProjectContextProvider project={projectMock1}>
    <IssuePanel issue={issue} />
  </ProjectContextProvider>
);

export const Default: Story = {
  render: () => (
    <WrappedStory issue={todoIssuesMock1[0]} />
  ),
  decorators: [
    (Story) => {
      return withRemixStub(withMainContext(Story));
    },
  ],
};

export const Empty: Story = {
  render: () => (
    <WrappedStory issue={undefined} />
  ),
  decorators: [
    (Story) => {
      return withRemixStub(withMainContext(Story));
    },
  ],
};
