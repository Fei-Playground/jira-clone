import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBase } from "./error-base";

const meta: Meta<typeof ErrorBase> =
  {
  title: "Components/ErrorBase",
  component: ErrorBase,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["500", "404"],
      },
    },
    message: {
      control: {
        type: "text",
      },
    },
    href: {
      control: {
        type: "text",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBase>;

export const NotFound: Story = {
  args: {
    variant: "404",
    message: "Back to home",
    href: "/",
  },
};

export const ServerError: Story = {
  args: {
    variant: "500",
    message: "Back to home",
    href: "/",
  },
};

export const NotFoundNoHref: Story = {
  args: {
    variant: "404",
    message: "Page not found",
    href: "",
  },
};

export const ServerErrorNoHref: Story = {
  args: {
    variant: "500",
    message: "Server error",
    href: "",
  },
};
