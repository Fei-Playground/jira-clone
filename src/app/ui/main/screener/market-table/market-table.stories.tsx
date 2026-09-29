import type { Meta, StoryObj } from "@storybook/react-vite";
import { marketsMock, hlCompositeMock, computeAllMetrics } from "@domain/market";
import { DEFAULT_VISIBLE_COLUMNS } from "../screener.store";
import { MarketTable } from "./market-table";

const meta: Meta<typeof MarketTable> = {
  title: "Pages/Main/Screener/MarketTable",
  component: MarketTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof MarketTable>;

const metricsById = computeAllMetrics(marketsMock, hlCompositeMock);

export const Default: Story = {
  args: {
    markets: marketsMock,
    metricsById,
    visibleColumns: DEFAULT_VISIBLE_COLUMNS,
    sort: { field: "dayNtlVlm", direction: "desc" },
    onSort: () => {},
    activeScanner: undefined,
    onSelectMarket: () => {},
    activeFilterCount: 0,
    searchTerm: "",
    onResetFilters: () => {},
    onClearScanner: () => {},
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    markets: [],
    activeFilterCount: 2,
    searchTerm: "zzz",
  },
};
