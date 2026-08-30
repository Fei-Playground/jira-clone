import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  /** When set, this comment is a reply to another comment on the same issue. */
  parentId?: CommentId;
}
