import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatBubble } from "./chat-bubble";

const meta: Meta<typeof ChatBubble> = {
  title: "OLGA/ChatBubble",
  component: ChatBubble,
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const Own: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    variant: "own",
    message: "Would love to compare notes on what you're seeing in the market.",
    timestamp: "2:34 PM",
  },
};

export const Other: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    variant: "other",
    message:
      "Hi — great to connect. I saw we're both focused on fintech Series A.",
    timestamp: "2:32 PM",
  },
};

export const Conversation: Story = {
  render: () => (
    <div className="max-w-sm space-y-4 p-4">
      <ChatBubble
        variant="other"
        message="Hi — great to connect. I saw we're both focused on fintech Series A."
        timestamp="2:32 PM"
      />
      <ChatBubble
        variant="own"
        message="Likewise! We've been watching the embedded finance space closely."
        timestamp="2:34 PM"
      />
      <ChatBubble
        variant="other"
        message="Primarily infrastructure — ledger and core banking API plays."
        timestamp="2:36 PM"
      />
      <ChatBubble
        variant="own"
        message="Perfect. We've actually got a portfolio company doing exactly that."
        timestamp="2:38 PM"
      />
    </div>
  ),
};
