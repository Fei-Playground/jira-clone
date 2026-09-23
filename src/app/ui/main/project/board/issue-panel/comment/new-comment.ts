import { v4 as uuid } from "uuid";
import { Comment, CommentId } from "@domain/comment";
import { User } from "@domain/user";

/**
 * Comments live in the issue panel's local state until the issue is
 * submitted, so a new one is staged with a temporary id that tells it
 * apart from the already persisted ones.
 */
export const newComment = (user: User, message: string, parentId?: CommentId): Comment => ({
  id: "temp-" + uuid(),
  user,
  message,
  parentId,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
