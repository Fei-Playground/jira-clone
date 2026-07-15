import type { Meta, StoryObj } from "@storybook/react-vite";
import type { EventTypeId } from "@domain/event-type";
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
  },
  decorators: [
    (Story) =>
      withRemixStub(
        <div style={{ width: 520 }}>
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
          isSubmitting={args?.isSubmitting || false}
        />
      ))}
    </div>
  ),
};

const eventTypeVariants: {
  eventType: EventTypeId;
  name: string;
}[] = [
  { eventType: "planning", name: "Sprint planning session" },
  { eventType: "review", name: "Sprint review" },
  { eventType: "retrospective", name: "Team retrospective" },
  { eventType: "standup", name: "Daily standup" },
  { eventType: "demo", name: "Product demo" },
  { eventType: "workshop", name: "Design workshop" },
  { eventType: "one_on_one", name: "1:1 with manager" },
  { eventType: "other", name: "Miscellaneous task" },
];

export const EventTypes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {eventTypeVariants.map(({ eventType, name }) => (
        <IssueCardContent
          key={eventType}
          link="https://google.com"
          name={name}
          priorityId="high"
          eventType={eventType}
          idPrefix={eventType.toUpperCase().slice(0, 4)}
          isSubmitting={false}
        />
      ))}
    </div>
  ),
};

export const WithEventTypeBadge: Story = {
  args: {
    link: "https://google.com",
    name: "Daily standup",
    priorityId: "high",
    eventType: "standup",
    idPrefix: "1234",
    isSubmitting: false,
  },
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
