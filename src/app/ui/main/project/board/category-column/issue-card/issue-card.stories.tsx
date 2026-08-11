import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRemixStub } from "@app/stories/utils";
import { IssueCardContent } from "./issue-card";

const meta: Meta<typeof IssueCardContent> = {
  title: "Pages/Project/IssueCard",
  component: IssueCardContent,
  parameters: {
    // padded (not centered) so cards sit near the top of the preview pane
    layout: "padded",
  },
  argTypes: {
    link: {
      control: { type: "text" },
    },
    name: {
      control: { type: "text" },
    },
    priorityId: {
      control: { type: "select" },
      options: ["low", "medium", "high"],
    },
    idPrefix: {
      control: { type: "text" },
    },
    isSubmitting: {
      control: { type: "boolean" },
    },
  },
  decorators: [
    (Story) =>
      withRemixStub(
        <div style={{ width: 280 }}>
          <Story />
        </div>
      ),
  ],
};

export default meta;
type Story = StoryObj<typeof IssueCardContent>;

/** Full-viewport dark canvas so bold-fill badges sit on the real dark surface. */
const withDarkSurface = (Story: () => JSX.Element) => (
  <div
    className="bg-elevation-surface p-4"
    style={{
      position: "fixed",
      inset: 0,
      overflow: "auto",
      boxSizing: "border-box",
    }}
  >
    {/* Re-apply column width — fixed positioning escapes the meta wrapper. */}
    <div style={{ width: 280 }}>
      <Story />
    </div>
  </div>
);

/** All three priorities side-by-side: left border + bold-fill badges (dark mode) */
export const AllPriorities: Story = {
  name: "All Priorities",
  globals: { theme: "dark" },
  decorators: [withDarkSurface],
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: 280 }}>
      <IssueCardContent
        link="/issue/low"
        name="Low priority issue"
        priorityId="low"
        idPrefix="LOW1"
        isSubmitting={false}
      />
      <IssueCardContent
        link="/issue/medium"
        name="Medium priority issue"
        priorityId="medium"
        idPrefix="MED1"
        isSubmitting={false}
      />
      <IssueCardContent
        link="/issue/high"
        name="High priority issue"
        priorityId="high"
        idPrefix="HIGH"
        isSubmitting={false}
      />
    </div>
  ),
};

export const LowPriority: Story = {
  name: "Low Priority",
  args: {
    link: "/issue/1",
    name: "Low priority issue",
    priorityId: "low",
    idPrefix: "LOW1",
    isSubmitting: false,
  },
};

export const MediumPriority: Story = {
  name: "Medium Priority",
  args: {
    link: "/issue/2",
    name: "Medium priority issue",
    priorityId: "medium",
    idPrefix: "MED1",
    isSubmitting: false,
  },
};

export const HighPriority: Story = {
  name: "High Priority",
  globals: { theme: "dark" },
  decorators: [withDarkSurface],
  args: {
    link: "/issue/3",
    name: "High priority issue",
    priorityId: "high",
    idPrefix: "HIGH",
    isSubmitting: false,
  },
};

export const LongName: Story = {
  name: "Long Name",
  args: {
    link: "/issue/4",
    name: "This is a very long issue name that should be truncated after two lines of text",
    priorityId: "medium",
    idPrefix: "LONG",
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    link: "/issue/5",
    name: "Submitting issue",
    priorityId: "low",
    idPrefix: "SUB1",
    isSubmitting: true,
  },
};
