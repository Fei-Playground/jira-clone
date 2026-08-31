import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { commentMock1, commentMock2, commentMock3 } from "@domain/comment";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";
import "react-toastify/dist/ReactToastify.css";

const now = Date.now();
const relativeComments = [
  {
    ...commentMock1,
    createdAt: now - 2 * 60 * 1000,
    updatedAt: now - 2 * 60 * 1000,
  },
  {
    ...commentMock2,
    createdAt: now - 3 * 60 * 60 * 1000,
    updatedAt: now - 3 * 60 * 60 * 1000,
  },
  {
    ...commentMock3,
    createdAt: now - 2 * 24 * 60 * 60 * 1000,
    updatedAt: now - 1 * 24 * 60 * 60 * 1000,
  },
];

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel/IssuePanelView",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        {withRemixStub(withMainContext(Story))}
      </ProjectContextProvider>
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
      comments: relativeComments,
    },
  },
};
