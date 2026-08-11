import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { BoardView } from "./board.view";

const meta: Meta<typeof BoardView> = {
  title: "Pages/Main/Project/Board/BoardView",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
    // Laptop-like viewport so multi-column board can overflow and scroll horizontally
    viewport: {
      defaultViewport: "laptop",
      viewports: {
        laptop: {
          name: "Laptop",
          styles: { width: "1024px", height: "768px" },
          type: "desktop",
        },
      },
    },
  },
  decorators: [
    (Story) => (
      // Explicit px height so CategoryColumn's offsetHeight measure gets a real value
      // (h-full alone collapses when intermediate Storybook/router roots have auto height).
      <div
        className="overflow-hidden"
        style={{ width: 1024, height: 768, maxWidth: "100%" }}
      >
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

export const LaptopWidth: Story = {
  name: "Laptop Width",
  args: {
    project: projectMock1,
  },
  decorators: [
    // Width-only wrapper — router/context come from the meta decorator
    (Story) => (
      <div
        className="h-full overflow-hidden border border-border-disabled"
        style={{ width: 900, maxWidth: "100%" }}
      >
        <Story />
      </div>
    ),
  ],
};
