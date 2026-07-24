import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IntentTag } from "./intent-tag";

const meta: Meta<typeof IntentTag> = {
  title: "OLGA/IntentTag",
  component: IntentTag,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof IntentTag>;

export const Default: Story = {
  args: { label: "Strategic partnerships" },
};

export const Selected: Story = {
  args: { label: "Angel investing", selected: true },
};

export const Removable: Story = {
  render: () => {
    const [selected, setSelected] = useState(true);
    return selected ? (
      <IntentTag
        label="BD conversations"
        selected
        onRemove={() => setSelected(false)}
      />
    ) : (
      <p className="text-sm text-olga-slate">Removed</p>
    );
  },
};

export const TagGroup: Story = {
  render: () => {
    const tags = [
      "Strategic partnerships",
      "Angel investing",
      "Technical co-founders",
      "BD conversations",
      "Product feedback",
    ];
    const [selected, setSelected] = useState<string[]>(["Angel investing"]);

    const toggle = (tag: string) =>
      setSelected((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );

    return (
      <div className="flex max-w-sm flex-wrap gap-2">
        {tags.map((tag) => (
          <IntentTag
            key={tag}
            label={tag}
            selected={selected.includes(tag)}
            onSelect={() => toggle(tag)}
            onRemove={selected.includes(tag) ? () => toggle(tag) : undefined}
          />
        ))}
      </div>
    );
  },
};
