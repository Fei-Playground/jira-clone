import type { Meta, StoryObj } from "@storybook/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { CategoryColumn } from "./category-column";

const meta: Meta<typeof CategoryColumn> = {
  title: "Pages/Main/Project/Board/CategoryColumn",
  component: CategoryColumn,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <DndProvider backend={HTML5Backend}>
        <ProjectContextProvider project={projectMock1}>
          {withRemixStub(withMainContext(Story))}
        </ProjectContextProvider>
      </DndProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CategoryColumn>;

const category = projectMock1.categories[0];

export const Default: Story = {
  args: {
    category: category,
    isDragging: false,
    submittingIssues: [],
    setSubmittingIssues: () => {},
    handleDragging: () => {},
  },
};

export const WithIssues: Story = {
  args: {
    category: category,
    isDragging: false,
    submittingIssues: [],
    setSubmittingIssues: () => {},
    handleDragging: () => {},
  },
};

export const Dragging: Story = {
  args: {
    category: category,
    isDragging: true,
    submittingIssues: [],
    setSubmittingIssues: () => {},
    handleDragging: () => {},
  },
};
