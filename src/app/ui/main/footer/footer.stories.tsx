import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { Footer } from "./footer";

const meta: Meta<typeof Footer> = {
  title: "Pages/Main/Footer",
  component: Footer,
  parameters: {
    layout: "top",
  },
  decorators: [
    (Story) => (
      <div className="w-full">{withRemixStub(withMainContext(Story))}</div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
