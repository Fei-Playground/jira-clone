import { CommentId } from "@domain/comment";
import { UserId } from "@domain/user";
import { db } from "./db.server";

export interface CommentOwnership {
  id: CommentId;
  userId: UserId;
}

export const getComment = async (commentId: CommentId): Promise<CommentOwnership | null> => {
  return db.comment.findUnique({
    where: { id: commentId },
    select: { id: true, userId: true },
  });
};

export const deleteComment = async (commentId: CommentId): Promise<void> => {
  await db.comment.delete({
    where: {
      id: commentId,
    },
  });
};
