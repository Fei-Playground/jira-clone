import type { Meta, StoryObj } from "@storybook/react-vite";
import { commentMock1, commentMock2, commentMock4 } from "@domain/comment";
import { projectMock1 } from "@domain/project";
import { userMock1 } from "@domain/user";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ProjectContextProvider } from "@app/ui/main/project";
import { ViewComment } from "./view-comment";
import { EditBox } from "./edit-box";
import { CommentMessage } from "./comment-message";

const CommentsWithMentions = () => {
  return (
    <div className="flex w-[520px] flex-col gap-6 rounded-md bg-elevation-surface p-6">
      <div className="flex flex-col gap-5">
        <ViewComment comment={commentMock1} removeComment={() => undefined} />
        <ViewComment comment={commentMock2} removeComment={() => undefined} />
        <ViewComment
          comment={{ ...commentMock4, user: userMock1 }}
          removeComment={() => undefined}
        />
      </div>
      <div className="border-border-primary border-t pt-4">
        <p className="mb-2 font-primary-light text-xs text-font-subtlest">
          Compose (type @ to mention)
        </p>
        <EditBox
          defaultMessage="Hey @Bu"
          autofocus
          save={() => undefined}
          cancel={() => undefined}
        />
      </div>
      <div className="border-border-primary border-t pt-4">
        <p className="mb-2 font-primary-light text-xs text-font-subtlest">
          Highlighted mentions
        </p>
        <CommentMessage
          message="Looping in @Buzz Lightyear and @Jessie on this. Thanks @Daniel Serrano!"
          users={projectMock1.users}
        />
      </div>
    </div>
  );
};

const meta: Meta<typeof CommentsWithMentions> = {
  title: "Pages/Main/Project/Board/IssuePanel/CommentsWithMentions",
  component: CommentsWithMentions,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        {withRemixStub(withMainContext(() => <Story />))}
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommentsWithMentions>;

export const MentionsAndPicker: Story = {};
