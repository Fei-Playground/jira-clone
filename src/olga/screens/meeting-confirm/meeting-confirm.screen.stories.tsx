import type { Meta, StoryObj } from "@storybook/react-vite";
import { MeetingConfirmScreen } from "./meeting-confirm.screen";

const meta: Meta<typeof MeetingConfirmScreen> = {
  title: "OLGA/Screens/09 Meeting Confirm",
  component: MeetingConfirmScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MeetingConfirmScreen>;

export const Default: Story = {};
