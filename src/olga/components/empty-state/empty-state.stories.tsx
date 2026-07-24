import type { Meta, StoryObj } from "@storybook/react-vite";
import { OlgaEmptyState } from "./empty-state";

const meta: Meta<typeof OlgaEmptyState> = {
  title: "OLGA/EmptyState",
  component: OlgaEmptyState,
  parameters: {
    layout: "padded",
    backgrounds: { default: "surface" },
  },
};

export default meta;
type Story = StoryObj<typeof OlgaEmptyState>;

export const NoProposals: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    headline: "No proposals yet",
    body: "Check in to a space to start receiving anonymous proposals from people with matching intents.",
  },
};

export const WithAction: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    ),
    headline: "No spaces nearby",
    body: "Try selecting a different city or check back when you're in a supported area.",
    action: { label: "Change city", onClick: () => {} },
  },
};
