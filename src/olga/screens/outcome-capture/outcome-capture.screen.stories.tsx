import type { Meta, StoryObj } from "@storybook/react-vite";
import { OutcomeCaptureScreen } from "./outcome-capture.screen";

const meta: Meta<typeof OutcomeCaptureScreen> = {
  title: "OLGA/Screens/10 Outcome Capture",
  component: OutcomeCaptureScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof OutcomeCaptureScreen>;

export const Default: Story = {
  args: { matchName: "Priya Sharma" },
};
