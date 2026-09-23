import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  /** Id of the comment this one replies to. Top-level comments leave it undefined. */
  parentId?: CommentId;
  createdAt: number;
  updatedAt: number;
}
