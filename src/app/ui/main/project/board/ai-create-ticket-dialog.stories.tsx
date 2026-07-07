import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { AiCreateTicketDialog } from "./ai-create-ticket-dialog";

const meta: Meta<typeof AiCreateTicketDialog> = {
  title: "Pages/Main/Project/Board/AiCreateTicketDialog",
  component: AiCreateTicketDialog,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="relative h-screen w-full bg-elevation-surface-sunken">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AiCreateTicketDialog>;

export const Open: Story = {
  args: {
    onClose: () => {},
  },
};
