import { User } from "../user";

export type CommentId = string;
export type ReplyId = string;

export interface Reply {
  id: ReplyId;
  user: User;
  message: string;
  createdAt: number;
}

export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  replies?: Reply[];
}
