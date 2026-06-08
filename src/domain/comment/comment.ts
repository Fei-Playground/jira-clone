import { User } from "../user";

export type CommentId = string;
// Reply is a comment nested under another comment (same structure as Comment)
export type Reply = Comment;

export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  // Nested replies form a conversation thread under this comment
  replies?: Reply[];
}
