import type { Meta, StoryObj } from "@storybook/react-vite";
import { OnboardingScreen } from "./onboarding.screen";

const meta: Meta<typeof OnboardingScreen> = {
  title: "OLGA/Screens/01 Onboarding",
  component: OnboardingScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof OnboardingScreen>;

export const Default: Story = {};
