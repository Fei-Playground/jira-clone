import { User } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  like_count?: number;
  dislike_count?: number;
  replies?: Comment[];
}
