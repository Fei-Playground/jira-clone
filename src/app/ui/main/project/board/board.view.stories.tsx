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
      <div className="flex h-screen flex-col p-6 [&>*]:flex [&>*]:h-full [&>*]:flex-col [&_.w-full]:flex [&_.w-full]:h-full [&_.w-full]:flex-col">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};

export const GanttMode: Story = {
  args: {
    project: projectMock1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ganttButton = await canvas.findByRole("tab", {
      name: /switch to gantt view/i,
    });
    await userEvent.click(ganttButton);
  },
};
