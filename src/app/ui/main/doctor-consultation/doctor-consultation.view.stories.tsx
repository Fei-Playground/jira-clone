import type { Meta, StoryObj } from "@storybook/react";
import { DoctorConsultationView } from "./doctor-consultation.view";

const meta = {
  title: "UI/Doctor Consultation",
  component: DoctorConsultationView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DoctorConsultationView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onContinue: () => alert("Continue button clicked"),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm bg-elevation-surface">
        <Story />
      </div>
    ),
  ],
};

export const WithoutInteraction: Story = {
  args: {
    onContinue: undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm bg-elevation-surface">
        <Story />
      </div>
    ),
  ],
};
