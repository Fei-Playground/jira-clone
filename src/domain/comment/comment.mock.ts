import { userMock1, usersMock } from "@domain/user";
import { Comment } from "./comment";

const createdAt = Date.now();
const updatedAt = Date.now();

// Mock replies for nested comments
const commentMock2Reply1: Comment = {
  id: "reply-001-3375b7ea",
  user: usersMock[5], // Mr. Potato
  message: "That's right! Ownership is key to maintaining comment integrity.",
  createdAt: createdAt + 60000, // 1 minute later
  updatedAt: createdAt + 60000,
  like_count: 2,
  dislike_count: 0,
};

const commentMock2Reply2: Comment = {
  id: "reply-002-3375b7ea",
  user: usersMock[6], // Ms. Potato
  message: "I agree with Mr. Potato. This feature prevents accidental edits.",
  createdAt: createdAt + 120000, // 2 minutes later
  updatedAt: createdAt + 120000,
  like_count: 5,
  dislike_count: 1,
  replies: [
    {
      id: "reply-003-reply-002",
      user: userMock1, // Daniel Serrano
      message:
        "Great point! This is a best practice in collaborative tools.",
      createdAt: createdAt + 180000, // 3 minutes later
      updatedAt: createdAt + 180000,
      like_count: 3,
      dislike_count: 0,
    },
  ],
};

export const commentMock1: Comment = {
  id: "92149ee5-0459-4286-8323-1542e1295154",
  user: usersMock[3], // Jessie
  message:
    "Depending on the user, some features are restricted. For example, only the reporter of an issue can edit the title and description.",
  createdAt,
  updatedAt,
  like_count: 3,
  dislike_count: 1,
};

export const commentMock2: Comment = {
  id: "3375b7ea-425d-4bd3-a728-c8888b63a7f2",
  user: usersMock[7], // Little Green Men
  message: "And only the original poster of a comment can edit or delete it!",
  createdAt,
  updatedAt,
  like_count: 8,
  dislike_count: 0,
  replies: [commentMock2Reply1, commentMock2Reply2],
};

export const commentMock3: Comment = {
  id: "ee000718-85e5-44ac-91e2-e29340fb0b61",
  user: usersMock[5], // Mr. Potato
  message:
    "This is not they only accessible feature implemented. By using Radix UI, components like select, dialog or checkboxes are accessible by default, and you can handle them with the keyboard.",
  createdAt,
  updatedAt,
  like_count: 4,
  dislike_count: 2,
};

export const commentMock4: Comment = {
  id: "c0db6d6f-f395-4882-8bf4-e644f0e45460",
  user: userMock1, // Daniel Serrano
  message:
    "By the way, the 404 error will be triggered if you modify the URL to any non existing path.",
  createdAt,
  updatedAt,
  like_count: 1,
  dislike_count: 0,
};

export const commentMock5: Comment = {
  id: "6c57eff9-f310-470a-b8e9-0f5234b63f5a",
  user: usersMock[6], // Ms. Potato
  message:
    "By the way, the 404 error will be triggered if you modify the URL to any non existing path.",
  createdAt,
  updatedAt,
  like_count: 0,
  dislike_count: 0,
};
