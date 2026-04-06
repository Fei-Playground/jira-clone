import type { Meta, StoryObj } from "@storybook/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1, projectMock2 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { BoardView } from "./board.view";

const meta: Meta<typeof BoardView> = {
  title: "Pages/Main/Project/BoardView",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <DndProvider backend={HTML5Backend}>
        {withRemixStub(withMainContext(Story))}
      </DndProvider>
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

export const Dark: Story = {
  args: {
    project: projectMock1,
  },
  parameters: {
    theme: "dark",
  },
};

export const ProjectMock2: Story = {
  args: {
    project: projectMock2,
  },
  decorators: [
    (Story) => (
      <DndProvider backend={HTML5Backend}>
        {withRemixStub(withMainContext(Story))}
      </DndProvider>
    ),
  ],
};
