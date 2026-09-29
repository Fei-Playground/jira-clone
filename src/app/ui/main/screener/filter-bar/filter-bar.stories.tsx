import type { Meta, StoryObj } from "@storybook/react-vite";
import { marketsMock, hlCompositeMock } from "@domain/market";
import { ScreenerContextProvider } from "../screener.store";
import { FilterBar } from "./filter-bar";

const meta: Meta<typeof FilterBar> = {
  title: "Pages/Main/Screener/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <ScreenerContextProvider markets={marketsMock} benchmark={hlCompositeMock}>
        <div className="w-[900px]">
          <Story />
        </div>
      </ScreenerContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {};
