import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, screen } from "storybook/test";
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
      <div className="h-screen p-6">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

/** Full board toolbar with Dates control next to Sort */
export const Default: Story = {
  args: {
    project: projectMock1,
  },
};

/** Board with Dates dropdown open (field, presets, custom range) */
export const DatesFilterOpen: Story = {
  args: {
    project: projectMock1,
  },
  play: async () => {
    await userEvent.click(
      await screen.findByRole("button", { name: /filter issues by date/i })
    );
    await screen.findByText("Date field");
  },
};
