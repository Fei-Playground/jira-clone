import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { Category } from "@domain/category";
import { ProjectContextProvider } from "@app/ui/main/project";
import { CategoryColumn } from "./category-column";

const noopSetSubmitting = () => {};
const noopDragging = () => {};

const baseArgs = {
  isDragging: false,
  submittingIssues: [] as string[],
  setSubmittingIssues: noopSetSubmitting,
  handleDragging: noopDragging,
};

const emptyCategory: Category = {
  ...projectMock1.categories[0],
  id: "empty-column",
  name: "To do",
  type: "TODO",
  issues: [],
};

const singleIssueCategory: Category = {
  ...projectMock1.categories[0],
  id: "single-issue-column",
  name: "To do",
  type: "TODO",
  issues: projectMock1.categories[0].issues.slice(0, 1),
};

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

/**
 * Side-by-side columns with different issue counts.
 * Play hovers the In Progress header *add button* (not the name label) so the
 * count tooltip proves it triggers from the entire header row.
 */
export const HeaderIssueCountTooltip: Story = {
  render: () => (
    <div className="flex h-[480px] items-stretch gap-4 p-4">
      {projectMock1.categories.map((category) => (
        <CategoryColumn
          key={category.id}
          category={category}
          {...baseArgs}
        />
      ))}
      <CategoryColumn category={emptyCategory} {...baseArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Hover the + control — outside the name/count label — to prove full-header trigger
    const addButton = canvas.getByRole("link", {
      name: "Add new In progress issue",
    });
    await userEvent.hover(addButton);
  },
};

export const Default: Story = {
  args: {
    category: projectMock1.categories[0],
    ...baseArgs,
  },
};

/** One issue — tooltip says "1 issue" (singular). */
export const SingleIssue: Story = {
  args: {
    category: singleIssueCategory,
    ...baseArgs,
  },
};

/** Multiple issues — tooltip says "N issues". */
export const MultipleIssues: Story = {
  args: {
    category: projectMock1.categories[1],
    ...baseArgs,
  },
};

/** Empty column — tooltip still shows "0 issues" on hover. */
export const Empty: Story = {
  args: {
    category: emptyCategory,
    ...baseArgs,
  },
};

export const Dragging: Story = {
  args: {
    category: projectMock1.categories[0],
    isDragging: true,
    submittingIssues: [],
    setSubmittingIssues: noopSetSubmitting,
    handleDragging: noopDragging,
  },
};
