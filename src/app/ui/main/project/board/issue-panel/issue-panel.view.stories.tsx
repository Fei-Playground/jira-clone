import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";
import {
  commentMock1,
  commentMock2,
  commentMock3,
  commentMock4,
  commentMock5,
} from "@domain/comment";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel/IssuePanelView",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-screen overflow-hidden">
        <ProjectContextProvider project={projectMock1}>
          {withRemixStub(withMainContext(Story))}
        </ProjectContextProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

const issue = todoIssuesMock1[0];

export const Default: Story = {
  args: {
    issue: issue,
  },
};

export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: [
        commentMock1,
        commentMock2,
        commentMock3,
        commentMock4,
        commentMock5,
      ],
    },
  },
};
