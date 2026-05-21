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
  replies: [
    {
      id: "reply-1-1",
      user: usersMock[5], // Mr. Potato
      message: "That makes sense for security and data integrity!",
      createdAt: createdAt + 1000 * 60 * 5, // 5 minutes later
      updatedAt: createdAt + 1000 * 60 * 5,
    },
  ],
};

export const commentMock2: Comment = {
  id: "3375b7ea-425d-4bd3-a728-c8888b63a7f2",
  user: usersMock[7], // Little Green Men
  message: "And only the original poster of a comment can edit or delete it!",
  createdAt,
  updatedAt,
  replies: [
    {
      id: "reply-2-1",
      user: userMock1, // Daniel Serrano
      message: "Exactly! This helps maintain accountability.",
      createdAt: createdAt + 1000 * 60 * 10, // 10 minutes later
      updatedAt: createdAt + 1000 * 60 * 10,
    },
    {
      id: "reply-2-2",
      user: usersMock[6], // Ms. Potato
      message: "Can we reply to comments though?",
      createdAt: createdAt + 1000 * 60 * 15, // 15 minutes later
      updatedAt: createdAt + 1000 * 60 * 15,
    },
  ],
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
