import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent } from "storybook/test";
import { marketsMock, hlCompositeMock, computeAllMetrics, scanners, ScannerId } from "@domain/market";
import { withRemixStub } from "@app/stories/utils";
import { ScannerPicker } from "./scanner-picker";

const meta: Meta<typeof ScannerPicker> = {
  title: "Pages/Main/Screener/ScannerPicker",
  component: ScannerPicker,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [(Story) => <div className="h-screen w-full">{withRemixStub(<Story />)}</div>],
};

export default meta;
type Story = StoryObj<typeof ScannerPicker>;

const metricsById = computeAllMetrics(marketsMock, hlCompositeMock);

const ScannerPickerDemo = () => {
  const [activeScannerId, setActiveScannerId] = useState<ScannerId | undefined>(undefined);
  const activeScanner = scanners.find((s) => s.id === activeScannerId);
  return (
    <ScannerPicker
      markets={marketsMock}
      metricsById={metricsById}
      activeScannerId={activeScannerId}
      activeScannerLabel={activeScanner?.label}
      onSelect={setActiveScannerId}
    />
  );
};

export const Default: Story = {
  render: () => <ScannerPickerDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const trigger = await canvas.findByRole("button", { name: /open scanner catalog/i });
    await userEvent.click(trigger);
    await canvas.findByRole("heading", { name: /scanners/i });
  },
};
