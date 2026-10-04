import type { Meta, StoryObj } from "@storybook/react-vite";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project/project.mock";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";
import { Category } from "@domain/category/category";
import { Issue } from "@domain/issue/issue";
import {
  todoIssuesMock2,
  inProgressIssuesMock1,
} from "@domain/issue/issue.mock";
import { CategoryColumn } from "./category-column";

const meta: Meta<typeof CategoryColumn> = {
  title: "Pages/Main/Project/Board/CategoryColumn",
  component: CategoryColumn,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <DndProvider backend={HTML5Backend}>
        <ProjectContextProvider project={projectMock1}>
          {withRemixStub(
            withMainContext(() => (
              <div className="flex p-6" style={{ height: 620 }}>
                <Story />
              </div>
            ))
          )}
        </ProjectContextProvider>
      </DndProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CategoryColumn>;

// The TODO column of projectMock1 only holds a single (DONE-typed) hint issue, so
// we build a TODO category out of the real issue mocks that now carry a mix of
// fresh / aging / stale createdAt dates, to show the aging indicator side by side.
const mixedTodoIssues: Issue[] = [
  // fresh (2 days) and aging (9 days)
  ...todoIssuesMock2,
  // stale (21 days)
  inProgressIssuesMock1[1],
].map((issue) => ({ ...issue, categoryType: "TODO" as const }));

const todoCategory: Category = {
  ...projectMock1.categories[0],
  type: "TODO",
  name: "To do",
  issues: mixedTodoIssues,
};

const doneCategory: Category = projectMock1.categories[2];

export const Default: Story = {
  args: {
    category: todoCategory,
    isDragging: false,
    submittingIssues: [],
    setSubmittingIssues: () => {},
    handleDragging: () => {},
  },
};

export const MixedAgingStates: Story = {
  args: {
    category: todoCategory,
    isDragging: false,
    submittingIssues: [],
    setSubmittingIssues: () => {},
    handleDragging: () => {},
  },
};

// DONE issues are excluded from aging by design: no hourglass, however old they are.
export const DoneColumnNoAging: Story = {
  args: {
    category: doneCategory,
    isDragging: false,
    submittingIssues: [],
    setSubmittingIssues: () => {},
    handleDragging: () => {},
  },
};

export const EmptyColumn: Story = {
  args: {
    category: { ...todoCategory, issues: [] },
    isDragging: false,
    submittingIssues: [],
    setSubmittingIssues: () => {},
    handleDragging: () => {},
  },
};

export const Dragging: Story = {
  args: {
    category: todoCategory,
    isDragging: true,
    submittingIssues: [],
    setSubmittingIssues: () => {},
    handleDragging: () => {},
  },
};
