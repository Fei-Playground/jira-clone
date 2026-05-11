import type { Meta, StoryObj } from "@storybook/react-vite";
import { GanttChart } from "./gantt-chart";
import { categoriesMock1, categoriesMock2 } from "@domain/category";
import { withMainContext, withRemixStub } from "@app/stories/utils";

const meta: Meta<typeof GanttChart> = {
  title: "Pages/Main/Project/Board/GanttChart",
  component: GanttChart,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => withRemixStub(withMainContext(Story)),
  ],
};

export default meta;
type Story = StoryObj<typeof GanttChart>;

export const Default: Story = {
  args: {
    categories: categoriesMock1,
  },
};

export const WithDifferentProject: Story = {
  args: {
    categories: categoriesMock2,
  },
};

export const EmptyCategories: Story = {
  args: {
    categories: [],
  },
};
