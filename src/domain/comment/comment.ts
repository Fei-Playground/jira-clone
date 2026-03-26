import { User } from "../user";

export type CommentId = string;

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  attachments?: Attachment[];
}
