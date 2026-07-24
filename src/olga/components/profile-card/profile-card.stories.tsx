import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnonymousProfileCard } from "./profile-card";

const meta: Meta<typeof AnonymousProfileCard> = {
  title: "OLGA/AnonymousProfileCard",
  component: AnonymousProfileCard,
  parameters: {
    layout: "padded",
    backgrounds: { default: "surface" },
  },
};

export default meta;
type Story = StoryObj<typeof AnonymousProfileCard>;

const baseArgs = {
  category: "Strategic partnerships",
  score: 94,
  explanation:
    "Both targeting Series A SaaS companies in fintech — rare overlap in investment thesis and operator experience.",
  intentSummary:
    "Open to: Strategic partnerships, cross-border BD, introductions to LP networks",
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="relative max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: { ...baseArgs, state: "default" },
};

export const ApprovedWaiting: Story = {
  decorators: [
    (Story) => (
      <div className="relative max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: { ...baseArgs, state: "approved-waiting" },
};

export const Expired: Story = {
  decorators: [
    (Story) => (
      <div className="relative max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: { ...baseArgs, state: "expired" },
};

export const TechnicalCategory: Story = {
  decorators: [
    (Story) => (
      <div className="relative max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    category: "Technical co-founders",
    score: 87,
    explanation:
      "Complementary technical depth: you bring distribution, they bring infrastructure.",
    intentSummary: "Open to: Co-founder conversations, early-stage equity",
    state: "default",
  },
};
