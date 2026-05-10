import type { Meta, StoryObj } from "@storybook/react-vite";
import { usersMock } from "@domain/user";
import { UserAvatar } from "./user-avatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Components/UserAvatar",
  component: UserAvatar,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "Woody",
  },
  argTypes: {
    name: {
      defaultValue: "John Doe",
      control: {
        type: "text",
      },
    },
    image: {
      control: {
        type: "text",
      },
    },
    color: {
      control: {
        type: "color",
      },
    },
    size: {
      control: {
        type: "number",
      },
    },
    variant: {
      control: {
        type: "radio",
      },
      options: ["default", "dark"],
    },
    tooltip: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

const userImage = usersMock[1].image;
const userName = usersMock[1].name;

export const Default: Story = {
  render: (_) => (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Standard Variants</h3>
        <div className="flex items-end gap-4">
          {[Image, Fallback, Tooltip, MediumSize, LargeSize].map(
            (UserAvatarStory, index) => (
              <UserAvatar name={userName} {...UserAvatarStory.args} key={index} />
            )
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Dark Variants</h3>
        <div className="flex items-end gap-4">
          {[DarkVariant, DarkVariantWithImage, DarkVariantLargeSize].map(
            (UserAvatarStory, index) => (
              <UserAvatar name={userName} {...UserAvatarStory.args} key={`dark-${index}`} />
            )
          )}
        </div>
      </div>
    </div>
  ),
};

export const Image: Story = {
  args: {
    image: userImage,
  },
};

export const Fallback: Story = {
  args: {
    image: undefined,
    color: "#dae3f9",
  },
};

export const Tooltip: Story = {
  args: {
    image: userImage,
    tooltip: true,
  },
};

export const MediumSize: Story = {
  args: {
    image: userImage,
    size: 48,
  },
};

export const LargeSize: Story = {
  args: {
    image: userImage,
    size: 82,
  },
};

export const DarkVariant: Story = {
  args: {
    image: undefined,
    color: "#2c3e5d",
    variant: "dark",
  },
};

export const DarkVariantWithImage: Story = {
  args: {
    image: userImage,
    variant: "dark",
  },
};

export const DarkVariantLargeSize: Story = {
  args: {
    image: userImage,
    size: 64,
    variant: "dark",
  },
};
