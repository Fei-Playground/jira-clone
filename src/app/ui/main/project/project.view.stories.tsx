import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { withMainContext } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectView } from "./project.view";
import { BoardView } from "./board/board.view";

const meta: Meta<typeof ProjectView> = {
  title: "Pages/Main/ProjectView",
  component: ProjectView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ProjectView>;

const withProjectBoardRoutes = (
  Story: () => React.ReactElement,
  initialPath = "/projects/jira-clone/board"
) => {
  const RemixStub = createRoutesStub([
    {
      path: "/projects/:projectId",
      Component: () => withMainContext(Story),
      children: [
        {
          path: "board",
          Component: () => <BoardView project={projectMock1} />,
        },
        {
          path: "analytics",
          Component: () => <div>Analytics</div>,
        },
        {
          path: "backlog",
          Component: () => <div>Backlog</div>,
        },
      ],
    },
  ]);

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <RemixStub initialEntries={[initialPath]} />
    </div>
  );
};

/** Main board page: "Sprint Board" heading above kanban columns */
export const SprintBoard: Story = {
  args: {
    name: projectMock1.name,
    description: projectMock1.description,
    image: projectMock1.image,
  },
  decorators: [(Story) => withProjectBoardRoutes(Story)],
};

export const Default: Story = {
  args: {
    name: projectMock1.name,
    description: projectMock1.description,
    image: projectMock1.image,
  },
  decorators: [(Story) => withProjectBoardRoutes(Story)],
};

export const WithoutDescription: Story = {
  args: {
    name: projectMock1.name,
    description: undefined,
    image: projectMock1.image,
  },
  decorators: [(Story) => withProjectBoardRoutes(Story)],
};

export const WithoutImage: Story = {
  args: {
    name: projectMock1.name,
    description: projectMock1.description,
    image: "",
  },
  decorators: [(Story) => withProjectBoardRoutes(Story)],
};
