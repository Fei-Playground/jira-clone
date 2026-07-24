import type { Meta, StoryObj } from "@storybook/react-vite";
import { CountdownTimer } from "./countdown-timer";

const meta: Meta<typeof CountdownTimer> = {
  title: "OLGA/CountdownTimer",
  component: CountdownTimer,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CountdownTimer>;

export const Normal: Story = {
  args: { secondsRemaining: 3600 },
};

export const Expiring: Story = {
  args: { secondsRemaining: 480 },
};

export const HoursFormat: Story = {
  args: { secondsRemaining: 7200 },
};
