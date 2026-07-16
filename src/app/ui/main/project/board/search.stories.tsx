import type { Meta, StoryObj } from "@storybook/react-vite";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { Search } from "./search";

const meta: Meta<typeof Search> = {
  title: "Pages/Main/Project/Board/Search",
  component: Search,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        <div className="p-4">
          <Story />
        </div>
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {};

export const TooltipVisible: Story = {
  play: async ({ canvasElement }) => {
    // Simulate hover on the search component to show the tooltip
    const tooltipContainer = canvasElement.querySelector(".relative");
    if (tooltipContainer) {
      const hoverEvent = new MouseEvent("mouseenter", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      tooltipContainer.dispatchEvent(hoverEvent);
    }
  },
};
