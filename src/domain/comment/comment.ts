import { User } from "../user/user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
}
