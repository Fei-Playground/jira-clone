import type { Meta, StoryObj, Decorator } from "@storybook/react-vite";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { projectMock1, projectMock2 } from "@domain/project";
import { BoardView } from "./board.view";

const createRemixDecorator = (theme?: "dark" | "light"): Decorator => {
  return (Story) => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        element: (
          <div className={theme} style={{ height: "100vh", width: "100vw" }}>
            <Story />
          </div>
        ),
      },
      {
        path: "/board/issue/issue-event",
        element: null,
      },
      {
        path: "issue/new",
        element: <div>New Issue</div>,
      },
    ]);

    return <RemixStub />;
  };
};

const meta: Meta<typeof BoardView> = {
  title: "Pages/Board",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BoardView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
  decorators: [createRemixDecorator()],
};

export const SecondProject: Story = {
  args: {
    project: projectMock2,
  },
  decorators: [createRemixDecorator()],
};

export const DefaultDark: Story = {
  args: {
    project: projectMock1,
  },
  decorators: [createRemixDecorator("dark")],
};

export const SecondProjectDark: Story = {
  args: {
    project: projectMock2,
  },
  decorators: [createRemixDecorator("dark")],
};
