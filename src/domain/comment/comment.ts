import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  /** When set, this comment is a reply to another comment. */
  parentId?: CommentId;
  createdAt: number;
  updatedAt: number;
}
