import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./search-input";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
  },
  args: {
    value: "",
    placeholder: "Filter projects",
    onChange: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    value: "sec",
  },
};
