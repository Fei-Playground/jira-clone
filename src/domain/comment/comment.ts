import { User } from "../user";

export type CommentId = string;
export type Reply = Comment;

export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  replies?: Reply[];
}
