import { User, UserId } from "../user";

export type CommentId = string;

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Mention {
  id: UserId;
  name: string;
  startIndex: number;
  endIndex: number;
}

export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  mentions?: Mention[];
  createdAt: number;
  updatedAt: number;
  attachments?: Attachment[];
}
