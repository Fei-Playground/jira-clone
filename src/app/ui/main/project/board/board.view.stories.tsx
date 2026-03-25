import type { Meta, StoryObj } from "@storybook/react-vite";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { projectMock1, projectMock2 } from "@domain/project";
import { BoardView } from "./board.view";

const meta: Meta<typeof BoardView> = {
  title: "Pages/Board",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: "/",
          element: <Story />,
          action: async () => {
            return { status: 200 };
          },
          loader: async () => {
            return {};
          },
        },
        {
          path: "issue/new",
          element: <div>New Issue Panel</div>,
        },
        {
          path: "board/issue/issue-event",
          element: null,
          loader: async () => {
            return new Response(null, { status: 200 });
          },
        },
      ]);

      return (
        <div className="h-screen w-full bg-elevation-surface p-6">
          <RemixStub />
        </div>
      );
    },
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
