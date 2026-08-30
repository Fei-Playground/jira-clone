import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { BoardView } from "./board.view";

const meta: Meta<typeof BoardView> = {
  title: "Pages/Main/Project/Board/BoardView",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="box-border h-screen p-6">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

/** Default board header + Kanban columns. */
export const Kanban: Story = {
  args: {
    project: projectMock1,
  },
};

/**
 * Gantt mode: timeline x-axis by date, one row per task, bars sized by
 * start/end and colored by status (TODO grey, IN_PROGRESS blue, DONE green).
 * Clicks the header Kanban/Gantt toggle so the real BoardView owns the mode.
 */
export const Gantt: Story = {
  args: {
    project: projectMock1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ganttToggle = await canvas.findByRole("button", {
      name: "Gantt view",
    });
    await userEvent.click(ganttToggle);
  },
};
