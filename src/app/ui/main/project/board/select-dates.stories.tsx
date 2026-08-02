import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, screen } from "storybook/test";
import { withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { SelectDates } from "./select-dates";

const meta: Meta<typeof SelectDates> = {
  title: "Pages/Main/Project/Board/SelectDates",
  component: SelectDates,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) =>
      withRemixStub(
        <ProjectContextProvider project={projectMock1}>
          <div className="flex items-start justify-start p-4">
            <Story />
          </div>
        </ProjectContextProvider>
      ),
  ],
};

export default meta;
type Story = StoryObj<typeof SelectDates>;

/** Closed trigger in default (Any time) state */
export const Default: Story = {};

/** Dropdown open: Created/Updated field, presets, custom range */
export const OpenDropdown: Story = {
  play: async () => {
    await userEvent.click(
      await screen.findByRole("button", { name: /filter issues by date/i })
    );
    await screen.findByText("Date field");
  },
};

/** Active filter with Last 7 days selected and clear action visible */
export const ActiveLast7Days: Story = {
  play: async () => {
    await userEvent.click(
      await screen.findByRole("button", { name: /filter issues by date/i })
    );
    await screen.findByText("Date field");
    await userEvent.click(await screen.findByText("Last 7 days"));
    await screen.findByText("Clear dates filter");
  },
};
