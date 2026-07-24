import type { Meta, StoryObj } from "@storybook/react-vite";
import { OlgaAppScreen } from "./olga-app.screen";

const meta: Meta<typeof OlgaAppScreen> = {
  title: "OLGA/App Shell",
  component: OlgaAppScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof OlgaAppScreen>;

export const SpacesTab: Story = {
  args: { initialTab: "spaces", isCheckedIn: false },
};

export const LiveTabCheckedIn: Story = {
  args: { initialTab: "live", isCheckedIn: true },
};

export const MatchesTab: Story = {
  args: { initialTab: "matches", isCheckedIn: true },
};
