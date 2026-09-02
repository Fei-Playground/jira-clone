import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
}
