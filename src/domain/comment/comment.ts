import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  /** Present when this comment is a reply to another comment. */
  parentId?: CommentId;
}
