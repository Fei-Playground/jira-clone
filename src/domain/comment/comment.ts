import { User } from "../user";

export type CommentId = string;

export interface Reply {
  id: string;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  replies?: Reply[];
}
