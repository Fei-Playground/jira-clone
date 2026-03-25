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
    (Story, context) => {
      // Check if this is a dark mode story via the story name
      const isDark = context.name.toLowerCase().includes('dark');
      
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
        <div 
          style={{ height: '100vh', width: '100%' }} 
          className={`bg-elevation-surface ${isDark ? 'dark' : ''}`}
        >
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

export const DefaultDark: Story = {
  args: {
    project: projectMock1,
  },
};

export const SecondProjectDark: Story = {
  args: {
    project: projectMock2,
  },
};
