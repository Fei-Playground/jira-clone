import { User, UserId } from "../user";

export type CommentId = string;
export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  mentions?: UserId[];
  createdAt: number;
  updatedAt: number;
  replies?: Comment[];
}
