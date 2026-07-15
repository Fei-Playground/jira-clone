import type { Meta, StoryObj } from "@storybook/react-vite";
import type { EventTypeId } from "@domain/event-type";
import { SelectEventType } from "./select-event-type";

const meta: Meta<typeof SelectEventType> = {
  title: "Pages/Main/Project/Board/IssuePanel/SelectEventType",
  component: SelectEventType,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SelectEventType>;

export const Standup: Story = {
  args: {
    initEventType: "standup" as EventTypeId,
  },
};

export const Planning: Story = {
  args: {
    initEventType: "planning" as EventTypeId,
  },
};

export const NoType: Story = {
  args: {},
};
