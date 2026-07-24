import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  parentId?: CommentId;
  createdAt: number;
  updatedAt: number;
}
