import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  /** Present when this comment is a reply to another comment. */
  parentId?: CommentId;
  createdAt: number;
  updatedAt: number;
}
