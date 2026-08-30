import type { Meta, StoryObj } from "@storybook/react-vite";
import { todoIssuesMock1 } from "@domain/issue";
import { SelectDates } from "./select-dates";

const meta: Meta<typeof SelectDates> = {
  title: "Pages/Main/Project/Board/IssuePanel/SelectDates",
  component: SelectDates,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex items-start justify-center bg-background-neutral p-8">
        <div className="w-80 rounded-lg bg-elevation-surface-overlay p-6 shadow-md">
          <p className="mb-1 text-font">Schedule</p>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SelectDates>;

const issue = todoIssuesMock1[0];

export const WithDates: Story = {
  args: {
    issue,
    readOnly: false,
  },
};

export const Empty: Story = {
  args: {
    issue: undefined,
    readOnly: false,
  },
};

export const ReadOnly: Story = {
  args: {
    issue,
    readOnly: true,
  },
};

export const WithError: Story = {
  args: {
    issue,
    readOnly: false,
    error: "End date must be on or after start date",
  },
};
