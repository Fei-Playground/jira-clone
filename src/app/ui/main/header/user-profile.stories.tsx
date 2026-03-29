import type { Meta, StoryObj } from "@storybook/react";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { UserProfile } from "./user-profile";

const meta: Meta<typeof UserProfile> = {
  title: "Pages/Main/Header/UserProfile",
  component: UserProfile,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="p-4">{withRemixStub(withMainContext(Story))}</div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserProfile>;

export const Default: Story = {};
