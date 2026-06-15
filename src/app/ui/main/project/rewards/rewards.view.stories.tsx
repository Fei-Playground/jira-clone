import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { rewardsMock } from "@domain/reward";
import { RewardsView } from "./rewards.view";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof RewardsView> = {
  title: "Pages/Main/Project/RewardsView",
  component: RewardsView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return withRemixStub(withMainContext(Story));
    },
  ],
};

export default meta;
type Story = StoryObj<typeof RewardsView>;

export const Default: Story = {
  args: {
    project: projectMock1,
    rewards: rewardsMock,
  },
};
