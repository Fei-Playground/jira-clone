import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  commentMock1,
  commentMock2,
  commentMock3,
  commentMock4,
  commentMock5,
} from "@domain/comment";
import { userMock1 } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import { formatDateTime } from "@utils/formatDateTime";
import {
  CommentFilters,
  CommentFiltersValue,
  DEFAULT_COMMENT_FILTERS,
  filterComments,
  getCommentAuthors,
} from "./comment-filters";

const comments = [
  commentMock1,
  commentMock2,
  commentMock3,
  commentMock4,
  {
    ...commentMock5,
    // Mark as edited so the Edited filter has a match
    updatedAt: commentMock5.createdAt + 60_000,
  },
];

const authors = getCommentAuthors(comments);
const currentUserId = userMock1.id;

const meta: Meta<typeof CommentFilters> = {
  title: "Pages/Main/Project/Board/IssuePanel/CommentFilters",
  component: CommentFilters,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof CommentFilters>;

const InteractiveFilters = ({
  initial = DEFAULT_COMMENT_FILTERS,
}: {
  initial?: CommentFiltersValue;
}): JSX.Element => {
  const [value, setValue] = useState<CommentFiltersValue>(initial);
  const filtered = filterComments(comments, value, currentUserId);

  return (
    <div className="w-full max-w-[560px] rounded-md bg-elevation-surface p-4">
      <p className="mb-2 font-primary-black text-font">Comments</p>
      <CommentFilters value={value} onChange={setValue} authors={authors} />
      <ul className="mt-6 space-y-5">
        {filtered.map((comment) => (
          <li key={comment.id} className="flex gap-4">
            <UserAvatar {...comment.user} size={32} />
            <div className="min-w-0">
              <p className="m-0">
                <span className="mr-2 font-primary-bold text-font">
                  {comment.user.name}
                </span>
                <span className="font-primary-light text-xs text-font-subtlest">
                  {formatDateTime(comment.createdAt)}
                </span>
              </p>
              <p className="mt-1 font-primary-light text-sm text-font">
                {comment.message}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="mt-6 text-sm text-font-subtlest">
          No comments match your filters
        </p>
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveFilters />,
};

export const MineSelected: Story = {
  render: () => (
    <InteractiveFilters
      initial={{ ...DEFAULT_COMMENT_FILTERS, scope: "mine" }}
    />
  ),
};

export const WithSearch: Story = {
  render: () => (
    <InteractiveFilters
      initial={{ ...DEFAULT_COMMENT_FILTERS, search: "accessible" }}
    />
  ),
};

export const AuthorSelected: Story = {
  render: () => (
    <InteractiveFilters
      initial={{
        ...DEFAULT_COMMENT_FILTERS,
        authorId: commentMock1.user.id,
      }}
    />
  ),
};
