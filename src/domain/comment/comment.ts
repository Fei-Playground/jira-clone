import { User } from "../user";

export type CommentId = string;

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  attachments?: Attachment[];
  createdAt: number;
  updatedAt: number;
}
