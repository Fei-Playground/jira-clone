import type { Meta, StoryObj } from "@storybook/react-vite";
import { marketsMock, hlCompositeMock } from "@domain/market";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ScreenerView } from "./screener.view";

const meta: Meta<typeof ScreenerView> = {
  title: "Pages/Main/Screener/ScreenerView",
  component: ScreenerView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-5">{withRemixStub(withMainContext(Story))}</div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ScreenerView>;

export const Default: Story = {
  args: {
    markets: marketsMock,
    benchmark: hlCompositeMock,
  },
};
