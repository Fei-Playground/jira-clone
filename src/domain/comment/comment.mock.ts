import { userMock1, usersMock } from "@domain/user";
import { Comment } from "./comment";

const createdAt = Date.now();
const updatedAt = Date.now();

export const commentMock1: Comment = {
  id: "92149ee5-0459-4286-8323-1542e1295154",
  user: usersMock[3], // Jessie
  message:
    "Depending on the user, some features are restricted. For example, only the reporter of an issue can edit the title and description.",
  createdAt,
  updatedAt,
};

export const commentMock2: Comment = {
  id: "3375b7ea-425d-4bd3-a728-c8888b63a7f2",
  user: usersMock[7], // Little Green Men
  message: "And only the original poster of a comment can edit or delete it!",
  createdAt,
  updatedAt,
};

export const commentMock3: Comment = {
  id: "ee000718-85e5-44ac-91e2-e29340fb0b61",
  user: usersMock[5], // Mr. Potato
  message:
    "This is not they only accessible feature implemented. By using Radix UI, components like select, dialog or checkboxes are accessible by default, and you can handle them with the keyboard.",
  createdAt,
  updatedAt,
};

export const commentMock4: Comment = {
  id: "c0db6d6f-f395-4882-8bf4-e644f0e45460",
  user: userMock1, // Daniel Serrano
  message:
    "By the way, the 404 error will be triggered if you modify the URL to any non existing path.",
  createdAt,
  updatedAt,
};

export const commentMock5: Comment = {
  id: "6c57eff9-f310-470a-b8e9-0f5234b63f5a",
  user: usersMock[6], // Ms. Potato
  message:
    "By the way, the 404 error will be triggered if you modify the URL to any non existing path.",
  createdAt,
  updatedAt,
};

/** Reply to commentMock1 — shows threaded reply UI in previews. */
export const commentMock1Reply: Comment = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  user: userMock1, // Daniel Serrano
  message: "Good call — I'll double-check reporter permissions before shipping.",
  createdAt: createdAt + 60_000,
  updatedAt: createdAt + 60_000,
  parentId: commentMock1.id,
};

/** Nested reply under commentMock1Reply. */
export const commentMock1ReplyNested: Comment = {
  id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  user: usersMock[3], // Jessie
  message: "Thanks! That should cover the edge cases we hit last sprint.",
  createdAt: createdAt + 120_000,
  updatedAt: createdAt + 120_000,
  parentId: commentMock1Reply.id,
};

/** Reply to commentMock2. */
export const commentMock2Reply: Comment = {
  id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
  user: usersMock[2], // Buzz Lightyear
  message: "Noted — I'll leave editing to the original author.",
  createdAt: createdAt + 90_000,
  updatedAt: createdAt + 90_000,
  parentId: commentMock2.id,
};
