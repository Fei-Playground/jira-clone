import type { Meta, StoryObj } from "@storybook/react";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { SelctTheme } from "./select-theme";

const meta: Meta<typeof SelctTheme> = {
  title: "Pages/Main/Header/SelectTheme",
  component: SelctTheme,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="p-4">{withRemixStub(withMainContext(Story))}</div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SelctTheme>;

export const Default: Story = {};

export const Dark: Story = {
  decorators: [
    (Story) => {
      const storyElement = Story();
      return (
        <div className="dark">
          {withRemixStub(
            withMainContext(
              () =>
                React.createElement("div", {
                  children: storyElement,
                })
            )
          )}
        </div>
      );
    },
  ],
};
