import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { inProgressIssuesMock1 } from "@domain/issue";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel/IssuePanelView",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        {withRemixStub(withMainContext(Story))}
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

/** Issue with top-level comments, replies, and a nested reply thread. */
const threadedIssue = inProgressIssuesMock1[1];

export const ThreadedComments: Story = {
  name: "Threaded comments",
  args: {
    issue: threadedIssue,
  },
};

/** Same threaded issue with the first comment's Reply composer opened. */
export const ReplyComposerOpen: Story = {
  name: "Reply composer open",
  args: {
    issue: threadedIssue,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const replyButtons = await canvas.findAllByRole("button", {
      name: "Reply to comment",
    });
    await userEvent.click(replyButtons[0]);
    await expect(
      canvas.getByPlaceholderText("Write a reply...")
    ).toBeInTheDocument();
  },
};

/** New issue panel with no comments yet. */
export const EmptyIssue: Story = {
  name: "Empty / new issue",
  args: {
    issue: undefined,
  },
};

/** Composer focused with @ typed so the mention menu is open. */
export const MentionMenuOpen: Story = {
  name: "Mention menu open",
  args: {
    issue: threadedIssue,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const composer = await canvas.findByPlaceholderText("Add your comment...");
    await userEvent.click(composer);
    await userEvent.type(composer, "Hey @");
    await expect(
      canvas.getByRole("listbox", { name: "Mention users" })
    ).toBeInTheDocument();
  },
};
