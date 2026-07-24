import type { Meta, StoryObj } from "@storybook/react-vite";
import { MatchScoreDisplay } from "./match-score";

const meta: Meta<typeof MatchScoreDisplay> = {
  title: "OLGA/MatchScoreDisplay",
  component: MatchScoreDisplay,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof MatchScoreDisplay>;

export const HighScore: Story = {
  args: {
    score: 94,
    explanation:
      "Both targeting Series A SaaS companies in fintech — rare overlap in investment thesis and operator experience.",
  },
};

export const MediumScore: Story = {
  args: {
    score: 72,
    explanation:
      "Both active in climate tech with overlapping portfolio thesis — worth a 15-minute exchange.",
  },
};
