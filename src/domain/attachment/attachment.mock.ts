import { userMock1, usersMock } from "@domain/user";
import { Attachment } from "./attachment";

const uploadedAt = Date.now();

export const attachmentMock1: Attachment = {
  id: "f8d2a1c3-9e5b-4e1a-b2d3-1c5a9d8e7f4b",
  name: "project-requirements.pdf",
  size: 2048576, // 2 MB
  type: "pdf",
  uploadedAt,
  uploadedBy: userMock1,
};

export const attachmentMock2: Attachment = {
  id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  name: "design-mockup.figma",
  size: 5242880, // 5 MB
  type: "figma",
  uploadedAt: uploadedAt - 86400000, // 1 day ago
  uploadedBy: usersMock[2],
};

export const attachmentMock3: Attachment = {
  id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
  name: "notes.txt",
  size: 153600, // 150 KB
  type: "txt",
  uploadedAt: uploadedAt - 172800000, // 2 days ago
  uploadedBy: usersMock[3],
};

export const attachmentsMock: Attachment[] = [
  attachmentMock1,
  attachmentMock2,
  attachmentMock3,
];
