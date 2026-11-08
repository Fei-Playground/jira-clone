import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRemixStub } from "@app/stories/utils";
import { IssueCardContent } from "./issue-card";

const NOW = Date.now();
const DAY_IN_MS = 24 * 60 * 60 * 1000;

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
    priorityId: {
      defaultValue: "high",
      control: {
        type: "text",
      },
    },
    idPrefix: {
      defaultValue: "1234",
      control: {
        type: "text",
      },
    },
    createdAt: {
      defaultValue: NOW,
      control: {
        type: "number",
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
          priorityId={args?.priorityId || "low"}
          idPrefix={args?.idPrefix || "1234"}
          createdAt={args?.createdAt || NOW}
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
    priorityId: "high",
    idPrefix: "1234",
    createdAt: NOW - 5 * 60 * 60 * 1000,
    isSubmitting: false,
  },
};

export const LongName: Story = {
  args: {
    link: "https://google.com",
    name: "This is a very long issue name that should be truncated",
    priorityId: "high",
    idPrefix: "1234",
    createdAt: NOW - 3 * DAY_IN_MS,
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    link: "https://google.com",
    name: "Submitting issue",
    priorityId: "low",
    idPrefix: "1234",
    createdAt: NOW - 14 * DAY_IN_MS,
    isSubmitting: true,
  },
};
