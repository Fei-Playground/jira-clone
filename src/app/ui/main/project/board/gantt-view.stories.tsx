import type { Meta, StoryObj } from "@storybook/react";
import { GanttView } from "./gantt-view";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";
import { Project } from "@domain/project";
import { userMock1, userMock2 } from "@domain/user";
import { priorityHigh, priorityMedium, priorityLow } from "@domain/priority";

const meta: Meta<typeof GanttView> = {
  title: "Components/GanttView",
  component: GanttView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof GanttView>;

// Create mock project with issues that have start and end dates across months
const mockProject: Project = {
  id: "gantt-project",
  name: "Gantt Chart Project",
  description: "Project with issues scheduled across months",
  users: [userMock1, userMock2],
  image: "https://admin.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10400?size=xxlarge",
  createdAt: new Date("2024-01-01").valueOf(),
  categories: [
    {
      id: "todo-category",
      type: "TODO",
      name: "To do",
      order: 0,
      createdAt: new Date("2024-01-01").valueOf(),
      updatedAt: new Date("2024-01-01").valueOf(),
      issues: [
        {
          id: "issue-1",
          name: "Design new dashboard",
          description: "Create wireframes and design mockups",
          reporter: userMock1,
          asignee: userMock1,
          comments: [],
          priority: priorityHigh,
          categoryType: "TODO",
          createdAt: new Date("2024-01-05").valueOf(),
          updatedAt: new Date("2024-01-05").valueOf(),
          start_date: new Date("2024-01-10").valueOf(),
          end_date: new Date("2024-01-25").valueOf(),
        },
        {
          id: "issue-2",
          name: "Research competitor features",
          description: "Analyze competitor products",
          reporter: userMock1,
          asignee: userMock1,
          comments: [],
          priority: priorityMedium,
          categoryType: "TODO",
          createdAt: new Date("2024-01-10").valueOf(),
          updatedAt: new Date("2024-01-10").valueOf(),
          start_date: new Date("2024-02-01").valueOf(),
          end_date: new Date("2024-02-14").valueOf(),
        },
      ],
    },
    {
      id: "in-progress-category",
      type: "IN_PROGRESS",
      name: "In progress",
      order: 1,
      createdAt: new Date("2024-01-01").valueOf(),
      updatedAt: new Date("2024-01-01").valueOf(),
      issues: [
        {
          id: "issue-3",
          name: "Implement authentication",
          description: "Setup user authentication system",
          reporter: userMock2,
          asignee: userMock2,
          comments: [],
          priority: priorityHigh,
          categoryType: "IN_PROGRESS",
          createdAt: new Date("2024-01-15").valueOf(),
          updatedAt: new Date("2024-01-15").valueOf(),
          start_date: new Date("2024-01-20").valueOf(),
          end_date: new Date("2024-02-10").valueOf(),
        },
        {
          id: "issue-4",
          name: "Setup database",
          description: "Configure PostgreSQL database",
          reporter: userMock2,
          asignee: userMock2,
          comments: [],
          priority: priorityHigh,
          categoryType: "IN_PROGRESS",
          createdAt: new Date("2024-01-08").valueOf(),
          updatedAt: new Date("2024-01-08").valueOf(),
          start_date: new Date("2024-01-15").valueOf(),
          end_date: new Date("2024-02-05").valueOf(),
        },
      ],
    },
    {
      id: "done-category",
      type: "DONE",
      name: "Done",
      order: 2,
      createdAt: new Date("2024-01-01").valueOf(),
      updatedAt: new Date("2024-01-01").valueOf(),
      issues: [
        {
          id: "issue-5",
          name: "Setup project repository",
          description: "Initialize git repo and CI/CD",
          reporter: userMock1,
          asignee: userMock1,
          comments: [],
          priority: priorityHigh,
          categoryType: "DONE",
          createdAt: new Date("2024-01-01").valueOf(),
          updatedAt: new Date("2024-01-05").valueOf(),
          start_date: new Date("2024-01-01").valueOf(),
          end_date: new Date("2024-01-05").valueOf(),
        },
        {
          id: "issue-6",
          name: "Write project documentation",
          description: "Create README and API docs",
          reporter: userMock1,
          asignee: userMock1,
          comments: [],
          priority: priorityMedium,
          categoryType: "DONE",
          createdAt: new Date("2024-01-03").valueOf(),
          updatedAt: new Date("2024-01-10").valueOf(),
          start_date: new Date("2024-01-08").valueOf(),
          end_date: new Date("2024-01-18").valueOf(),
        },
        {
          id: "issue-7",
          name: "Plan sprint schedule",
          description: "Define sprint goals and timeline",
          reporter: userMock2,
          asignee: userMock2,
          comments: [],
          priority: priorityLow,
          categoryType: "DONE",
          createdAt: new Date("2024-01-02").valueOf(),
          updatedAt: new Date("2024-01-08").valueOf(),
          start_date: new Date("2024-01-02").valueOf(),
          end_date: new Date("2024-01-12").valueOf(),
        },
      ],
    },
  ],
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <ProjectContextProvider project={mockProject}>
        <Story />
      </ProjectContextProvider>
    ),
  ],
  args: {
    project: mockProject,
  },
};

export const EmptyState: Story = {
  decorators: [
    (Story) => (
      <ProjectContextProvider
        project={{
          ...mockProject,
          categories: mockProject.categories.map((cat) => ({
            ...cat,
            issues: cat.issues.map((issue) => ({
              ...issue,
              start_date: undefined,
              end_date: undefined,
            })),
          })),
        }}
      >
        <Story />
      </ProjectContextProvider>
    ),
  ],
  args: {
    project: {
      ...mockProject,
      categories: mockProject.categories.map((cat) => ({
        ...cat,
        issues: cat.issues.map((issue) => ({
          ...issue,
          start_date: undefined,
          end_date: undefined,
        })),
      })),
    },
  },
};

export const WithFilteredPriorities: Story = {
  decorators: [
    (Story) => {
      // This story would show filtered results - the component respects priorityFilter from the store
      // For now, we show the full Gantt chart
      return (
        <ProjectContextProvider project={mockProject}>
          <Story />
        </ProjectContextProvider>
      );
    },
  ],
  args: {
    project: mockProject,
  },
};
