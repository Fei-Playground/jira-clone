import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1, inProgressIssuesMock1 } from "@domain/issue";
import { userMock1, userMock2, usersMock } from "@domain/user";
import { commentMock4, commentMock5 } from "@domain/comment";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";
import { Issue, Label, LinkedIssue, ActivityEntry } from "@domain/issue";
import "react-toastify/dist/ReactToastify.css";

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

// Sample labels for demonstration - use IDs matching availableLabels in SelectLabels component
const sampleLabels: Label[] = [
  { id: "bug", name: "Bug", color: "#ef4444" },
  { id: "feature", name: "Feature", color: "#3b82f6" },
  { id: "enhancement", name: "Enhancement", color: "#8b5cf6" },
];

// Sample linked issues for demonstration
const sampleLinkedIssues: LinkedIssue[] = [
  { issueId: inProgressIssuesMock1[0].id, issueName: inProgressIssuesMock1[0].name, relationType: "blocks" },
  { issueId: inProgressIssuesMock1[1].id, issueName: inProgressIssuesMock1[1].name, relationType: "relates_to" },
];

// Sample activity history for demonstration
const sampleActivityHistory: ActivityEntry[] = [
  {
    id: "activity-1",
    userId: userMock1.id,
    userName: userMock1.name,
    action: "changed status from TODO to IN_PROGRESS",
    timestamp: new Date("2022-01-20 14:30").valueOf(),
    changeDetails: { field: "status", oldValue: "TODO", newValue: "IN_PROGRESS" },
  },
  {
    id: "activity-2",
    userId: userMock2.id,
    userName: userMock2.name,
    userImage: userMock2.image,
    action: "changed priority from LOW to HIGH",
    timestamp: new Date("2022-01-21 10:15").valueOf(),
    changeDetails: { field: "priority", oldValue: "LOW", newValue: "HIGH" },
  },
  {
    id: "activity-3",
    userId: usersMock[2].id,
    userName: usersMock[2].name,
    userImage: usersMock[2].image,
    action: "assigned issue to Woody",
    timestamp: new Date("2022-01-22 09:00").valueOf(),
    changeDetails: { field: "assignee", oldValue: "Daniel Serrano", newValue: "Woody" },
  },
];

// Create a rich issue with all the new features populated
const richIssue: Issue = {
  ...todoIssuesMock1[0],
  dueDate: new Date("2022-02-28").valueOf(),
  labels: sampleLabels,
  linkedIssues: sampleLinkedIssues,
  watchers: [userMock1, userMock2, usersMock[2], usersMock[3]],
  activityHistory: sampleActivityHistory,
  comments: [commentMock4, commentMock5],
};

export const Default: Story = {
  args: {
    issue: todoIssuesMock1[0],
  },
};

export const WithAllFeatures: Story = {
  args: {
    issue: richIssue,
  },
};

export const WithComments: Story = {
  args: {
    issue: {
      ...todoIssuesMock1[0],
      comments: [commentMock4, commentMock5],
    },
  },
};
