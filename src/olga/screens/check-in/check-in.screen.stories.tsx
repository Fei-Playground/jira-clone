import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckInScreen } from "./check-in.screen";

const meta: Meta<typeof CheckInScreen> = {
  title: "OLGA/Screens/05 Check-in",
  component: CheckInScreen,
  parameters: { layout: "fullscreen" },
  argTypes: {
    checkInState: {
      control: "select",
      options: [
        "scanning",
        "success",
        "error-network",
        "error-invalid-qr",
        "error-wrong-venue",
        "error-already-checked-in",
        "error-session-active",
        "error-venue-full",
        "error-camera-denied",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckInScreen>;

export const Scanning: Story = {
  args: { checkInState: "scanning", venueName: "Soho Works White City" },
};

export const Success: Story = {
  args: { checkInState: "success", venueName: "Soho Works White City" },
};

export const ErrorInvalidQR: Story = {
  args: {
    checkInState: "error-invalid-qr",
    venueName: "Soho Works White City",
  },
};

export const ErrorAlreadyCheckedIn: Story = {
  args: {
    checkInState: "error-already-checked-in",
    venueName: "Soho Works White City",
  },
};

export const ErrorCameraDenied: Story = {
  args: {
    checkInState: "error-camera-denied",
    venueName: "Soho Works White City",
  },
};

export const ErrorVenueFull: Story = {
  args: {
    checkInState: "error-venue-full",
    venueName: "Soho Works White City",
  },
};
