import type { Meta, StoryObj } from "@storybook/react-vite";
import { commentMock1, commentMock2, commentMock4 } from "@domain/comment";
import { projectMock1 } from "@domain/project";
import { userMock1 } from "@domain/user";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ProjectContextProvider } from "@app/ui/main/project";
import { ViewComment } from "./view-comment";

const meta: Meta<typeof ViewComment> = {
  title: "Pages/Main/Project/Board/IssuePanel/ViewComment",
  component: ViewComment,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        {withRemixStub(
          withMainContext(() => (
            <div className="w-[480px] bg-elevation-surface p-6">
              <Story />
            </div>
          ))
        )}
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ViewComment>;

export const WithMentions: Story = {
  args: {
    comment: commentMock1,
    removeComment: () => undefined,
  },
};

export const MentionQuestion: Story = {
  args: {
    comment: commentMock2,
    removeComment: () => undefined,
  },
};

export const OwnCommentWithMention: Story = {
  args: {
    comment: {
      ...commentMock4,
      user: userMock1,
    },
    removeComment: () => undefined,
  },
};
