import type { Meta, StoryObj } from "@storybook/react-vite";
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
    isSubmitting: {
      defaultValue: false,
      control: {
        type: "boolean",
      },
    },
    agingLevel: {
      defaultValue: "fresh",
      control: {
        type: "select",
        options: ["fresh", "aging", "stale"],
      },
    },
    ageInDays: {
      defaultValue: 0,
      control: {
        type: "number",
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
      {[Standard, LongName, Submitting, Aging, Stale].map(({ args }, index) => (
        <IssueCardContent
          key={index}
          link={args?.link || "https://google.com"}
          name={args?.name || "Issue name"}
          priorityId={args?.priorityId || "low"}
          idPrefix={args?.idPrefix || "1234"}
          isSubmitting={args?.isSubmitting || false}
          agingLevel={args?.agingLevel || "fresh"}
          ageInDays={args?.ageInDays || 0}
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
    isSubmitting: false,
  },
};

export const LongName: Story = {
  args: {
    link: "https://google.com",
    name: "This is a very long issue name that should be truncated",
    priorityId: "high",
    idPrefix: "1234",
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    link: "https://google.com",
    name: "Submitting issue",
    priorityId: "low",
    idPrefix: "1234",
    isSubmitting: true,
  },
};

export const Aging: Story = {
  args: {
    link: "https://google.com",
    name: "Issue sitting without progress for over a week",
    priorityId: "medium",
    idPrefix: "1234",
    isSubmitting: false,
    agingLevel: "aging",
    ageInDays: 9,
  },
};

export const Stale: Story = {
  args: {
    link: "https://google.com",
    name: "Issue sitting without progress for over two weeks",
    priorityId: "high",
    idPrefix: "1234",
    isSubmitting: false,
    agingLevel: "stale",
    ageInDays: 21,
  },
};
