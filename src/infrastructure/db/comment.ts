import { CommentId } from "@domain/comment";
import { db } from "./db.server";

/**
 * Updates a comment's message and sets the updatedAt timestamp.
 * Used when users edit their comments in the issue panel.
 */
export const updateComment = async (commentId: CommentId, message: string): Promise<void> => {
  await db.comment.update({
    where: {
      id: commentId,
    },
    data: {
      message,
      updatedAt: new Date(),
    },
  });
};

export const deleteComment = async (commentId: CommentId): Promise<void> => {
  await db.comment.delete({
    where: {
      id: commentId,
    },
  });
};
