import { User, UserId } from "../user";

export type AttachmentId = string;
export interface Attachment {
  id: AttachmentId;
  name: string;
  size: number; // in bytes
  type: string; // file extension
  uploadedAt: number;
  uploadedBy: User;
}
