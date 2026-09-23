import { userMock1, userMock2, usersMock } from "@domain/user";
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
    "Both error pages are also reachable from the sidebar, under the Server error and Not found sections.",
  createdAt,
  updatedAt,
};

export const commentMock6: Comment = {
  id: "8c1c5b0e-2f6f-4f7e-9f1f-0a4f1b2c3d4e",
  user: usersMock[2], // Buzz Lightyear
  message:
    "Good to know, @Daniel Serrano. The error page also keeps a link back to the board, so you are never stuck there.",
  parentId: commentMock4.id,
  createdAt,
  updatedAt,
};

export const commentMock7: Comment = {
  id: "b7d3f2a1-6e2c-4b8d-9a3f-5c7e1d0b4a92",
  user: userMock2, // Woody
  message:
    "Confirmed on my side as well, @Ms Potato. Switching themes is a quick way to check the 404 view still renders.",
  parentId: commentMock5.id,
  createdAt,
  updatedAt,
};

export const commentMock8: Comment = {
  id: "d2a4e9c7-3b18-4d6a-8f52-91c0be7a6d31",
  user: usersMock[7], // Little Green Men
  message:
    "And the sidebar stays mounted, so you can jump straight back to another project from there.",
  parentId: commentMock4.id,
  createdAt,
  updatedAt,
};
