import type { Meta, StoryObj } from "@storybook/react-vite";
import { priorityHigh, priorityLow } from "@domain/priority";
import { withRemixStub } from "@app/stories/utils";
import { IssueCardContent } from "./issue-card";

const meta: Meta<typeof IssueCardContent> = {
  title: "Pages/Project/IssueCard",
  component: IssueCardContent,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    link: {
      defaultValue: "https://google.com",
      control: {
        type: "text",
      },
    },
    name: {
      defaultValue: "Issue name",
      control: {
        type: "text",
      },
    },
    priority: {
      defaultValue: priorityHigh,
      control: {
        type: "object",
      },
    },
    idPrefix: {
      defaultValue: "1234",
      control: {
        type: "text",
      },
    },
    isSubmitting: {
      defaultValue: false,
      control: {
        type: "boolean",
      },
    },
  },
  decorators: [
    (Story) =>
      withRemixStub(
        <div style={{ width: 230 }}>
          <Story />
        </div>
      ),
  ],
};

export default meta;
type Story = StoryObj<typeof IssueCardContent>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[Standard, LongName, Submitting].map(({ args }, index) => (
        <IssueCardContent
          key={index}
          link={args?.link || "https://google.com"}
          name={args?.name || "Issue name"}
          priority={args?.priority || priorityLow}
          idPrefix={args?.idPrefix || "1234"}
          isSubmitting={args?.isSubmitting || false}
        />
      ))}
    </div>
  ),
};

export const Standard: Story = {
  args: {
    link: "https://google.com",
    name: "Issue 1",
    priority: priorityHigh,
    idPrefix: "1234",
    isSubmitting: false,
  },
};

export const LongName: Story = {
  args: {
    link: "https://google.com",
    name: "This is a very long issue name that should be truncated",
    priority: priorityHigh,
    idPrefix: "1234",
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    link: "https://google.com",
    name: "Submitting issue",
    priority: priorityLow,
    idPrefix: "1234",
    isSubmitting: true,
  },
};
