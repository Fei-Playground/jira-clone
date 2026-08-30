import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { Issue } from "@domain/issue";
import { GanttChart } from "./gantt-chart";

const issuesFromProject = (project = projectMock1): Issue[] =>
  project.categories.flatMap((category) =>
    category.issues.map((issue) => ({
      ...issue,
      categoryType: issue.categoryType ?? category.type,
    }))
  );

const meta: Meta<typeof GanttChart> = {
  title: "Pages/Main/Project/Board/GanttChart",
  component: GanttChart,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="box-border flex h-screen flex-col p-6">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GanttChart>;

/** Timeline with status-colored bars sized by start/end dates. */
export const Default: Story = {
  args: {
    issues: issuesFromProject(),
  },
};

export const Empty: Story = {
  args: {
    issues: [],
  },
};
