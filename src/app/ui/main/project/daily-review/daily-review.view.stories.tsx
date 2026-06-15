import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { DailyReviewView } from "./daily-review.view";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof DailyReviewView> = {
  title: "Pages/Main/Project/DailyReviewView",
  component: DailyReviewView,
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
type Story = StoryObj<typeof DailyReviewView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};
