import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveToggle } from "./live-toggle";

const meta: Meta<typeof LiveToggle> = {
  title: "Pages/Main/Screener/LiveToggle",
  component: LiveToggle,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof LiveToggle>;

const LiveToggleDemo = ({ initial }: { initial: boolean }) => {
  const [isLive, setIsLive] = useState(initial);
  return <LiveToggle isLive={isLive} onChange={setIsLive} />;
};

export const Off: Story = {
  render: () => <LiveToggleDemo initial={false} />,
};

export const On: Story = {
  render: () => <LiveToggleDemo initial={true} />,
};
