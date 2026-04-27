import type { Meta, StoryObj } from "@storybook/react";
import { DoctorProfileImage } from "./doctor-profile-image";

const meta = {
  title: "UI/Doctor Profile Image",
  component: DoctorProfileImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DoctorProfileImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMainAndSecondaryImages: Story = {
  args: {
    mainImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    mainImageAlt: "Doctor profile",
    secondaryImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1507527173995-5f5ee139fbaa?w=100&h=100&fit=crop",
    ],
  },
  decorators: [
    (Story) => (
      <div className="flex h-96 w-80 items-center justify-center bg-elevation-surface">
        <Story />
      </div>
    ),
  ],
};

export const MainImageOnly: Story = {
  args: {
    mainImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    mainImageAlt: "Doctor profile",
  },
  decorators: [
    (Story) => (
      <div className="flex h-96 w-80 items-center justify-center bg-elevation-surface">
        <Story />
      </div>
    ),
  ],
};

export const NoImage: Story = {
  args: {
    secondaryImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    ],
  },
  decorators: [
    (Story) => (
      <div className="flex h-96 w-80 items-center justify-center bg-elevation-surface">
        <Story />
      </div>
    ),
  ],
};
