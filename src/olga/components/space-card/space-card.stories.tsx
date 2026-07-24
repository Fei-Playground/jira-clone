import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpaceCard } from "./space-card";

const meta: Meta<typeof SpaceCard> = {
  title: "OLGA/SpaceCard",
  component: SpaceCard,
  parameters: {
    layout: "padded",
    backgrounds: { default: "surface" },
  },
};

export default meta;
type Story = StoryObj<typeof SpaceCard>;

export const HighMatch: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    name: "Soho Works White City",
    distanceKm: 3.2,
    density: 48,
    intents: ["Strategic partnerships", "Angel investing", "BD conversations"],
    matchPotential: 91,
  },
};

export const MediumMatch: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    name: "Second Home Spitalfields",
    distanceKm: 2.1,
    density: 24,
    intents: [
      "Strategic partnerships",
      "Technical co-founders",
      "Product feedback",
    ],
    matchPotential: 78,
  },
};

export const DensitySuppressed: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    name: "The Hoxton Boardroom",
    distanceKm: 0.9,
    density: 3,
    intents: ["Strategic partnerships", "Angel investing"],
    matchPotential: 42,
  },
};

export const SpaceList: Story = {
  render: () => (
    <div className="max-w-sm space-y-3">
      <SpaceCard
        name="Soho Works White City"
        distanceKm={3.2}
        density={48}
        intents={[
          "Strategic partnerships",
          "Angel investing",
          "BD conversations",
        ]}
        matchPotential={91}
      />
      <SpaceCard
        name="Protein Studios Shoreditch"
        distanceKm={1.8}
        density={8}
        intents={["Technical co-founders", "Product feedback"]}
        matchPotential={85}
      />
      <SpaceCard
        name="The Hoxton Boardroom"
        distanceKm={0.9}
        density={3}
        intents={["Strategic partnerships"]}
        matchPotential={42}
      />
    </div>
  ),
};
