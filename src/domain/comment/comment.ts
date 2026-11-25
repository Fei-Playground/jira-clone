import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
}

// A comment only counts when it holds real text: surrounding whitespace is
// trimmed away, and a message left empty by that trim is not saved at all.
export const normalizeComments = (comments: Comment[]): Comment[] => {
  return comments
    .map((comment) => ({ ...comment, message: comment.message.trim() }))
    .filter((comment) => comment.message.length > 0);
};
