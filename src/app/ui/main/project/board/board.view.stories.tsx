import type { Meta, StoryObj } from "@storybook/react-vite";
import { projectMock1, projectMock2 } from "@domain/project";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { BoardView } from "./board.view";

const meta: Meta<typeof BoardView> = {
  title: "Pages/Board",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => withMainContext(Story),
    (Story) => withRemixStub(<Story />),
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};

export const SecondProject: Story = {
  args: {
    project: projectMock2,
  },
};

export const DefaultDark: Story = {
  args: {
    project: projectMock1,
  },
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
};

export const SecondProjectDark: Story = {
  args: {
    project: projectMock2,
  },
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
};
