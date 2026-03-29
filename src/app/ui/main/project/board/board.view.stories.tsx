import type { Meta, StoryObj } from "@storybook/react";
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
      <div className="h-screen">
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
