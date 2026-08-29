import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { BoardView } from "./board.view";

const meta: Meta<typeof BoardView> = {
  title: "Pages/Main/Project/Board/BoardView",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
    docs: { disable: true },
    viewport: { defaultViewport: "desktop" },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
          className="bg-background"
        >
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
            }}
            className="w-full"
          >
            {withRemixStub(withMainContext(Story))}
          </div>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

export const Default: Story = {
  render: (args) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <BoardView {...args} />
      </div>
    );
  },
  args: {
    project: projectMock1,
  },
};
