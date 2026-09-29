import type { Meta, StoryObj } from "@storybook/react-vite";
import { marketsMock, hlCompositeMock, computeAllMetrics } from "@domain/market";
import { withRemixStub } from "@app/stories/utils";
import { MarketDetailPanel } from "./market-detail-panel";

const meta: Meta<typeof MarketDetailPanel> = {
  title: "Pages/Main/Screener/MarketDetailPanel",
  component: MarketDetailPanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [(Story) => <div className="h-screen">{withRemixStub(<Story />)}</div>],
};

export default meta;
type Story = StoryObj<typeof MarketDetailPanel>;

const metricsById = computeAllMetrics(marketsMock, hlCompositeMock);
const btc = marketsMock.find((m) => m.symbol === "BTC")!;

export const Default: Story = {
  args: {
    market: btc,
    metrics: metricsById[btc.id],
    onClose: () => {},
  },
};
