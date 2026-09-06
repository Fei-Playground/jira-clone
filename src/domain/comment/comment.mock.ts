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
      id: "a1b2c3d4-1111-4a1a-9a1a-1a1a1a1a1a1a",
      user: usersMock[7], // Little Green Men
      message: "@Jessie Good to know — I was wondering why I couldn't rename this issue.",
      createdAt,
      updatedAt,
    },
    {
      id: "a1b2c3d4-2222-4a2a-9a2a-2a2a2a2a2a2a",
      user: userMock1, // Daniel Serrano
      message: "Exactly, it's a permission thing. Only the reporter sees the editable fields.",
      createdAt,
      updatedAt,
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
      id: "a1b2c3d4-3333-4a3a-9a3a-3a3a3a3a3a3a",
      user: usersMock[5], // Mr. Potato
      message: "But anyone can reply to it, which is what we just added.",
      createdAt,
      updatedAt,
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
    "@Buzz Lightyear By the way, the 404 error will be triggered if you modify the URL to any non existing path.",
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
