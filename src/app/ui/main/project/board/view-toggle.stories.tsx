import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewToggle, BoardViewMode } from "./view-toggle";

const meta: Meta<typeof ViewToggle> = {
  title: "Pages/Main/Project/Board/ViewToggle",
  component: ViewToggle,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ViewToggle>;

export const KanbanActive: Story = {
  args: {
    viewMode: "kanban",
    onToggle: () => undefined,
  },
};

export const GanttActive: Story = {
  args: {
    viewMode: "gantt",
    onToggle: () => undefined,
  },
};

/** Interactive toggle so both modes can be exercised in the canvas. */
export const Interactive: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState<BoardViewMode>("gantt");
    return <ViewToggle viewMode={viewMode} onToggle={setViewMode} />;
  },
};
