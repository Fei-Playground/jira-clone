import { userMock1, usersMock } from "@domain/user";
import { Comment } from "./comment";

const createdAt = Date.now();
const updatedAt = Date.now();

export const commentMock1: Comment = {
  id: "92149ee5-0459-4286-8323-1542e1295154",
  user: usersMock[1], // Mom
  message: "Great job finishing this one! 🌟",
  createdAt,
  updatedAt,
};

export const commentMock2: Comment = {
  id: "3375b7ea-425d-4bd3-a728-c8888b63a7f2",
  user: usersMock[0], // Izzy
  message: "Thanks Mom! I'll do the litter box after lunch.",
  parentId: "92149ee5-0459-4286-8323-1542e1295154", // Reply to commentMock1
  createdAt,
  updatedAt,
};

export const commentMock3: Comment = {
  id: "ee000718-85e5-44ac-91e2-e29340fb0b61",
  user: usersMock[1], // Mom
  message: "Remember to check this off once done. I'll be home by 3pm.",
  createdAt,
  updatedAt,
};

export const commentMock4: Comment = {
  id: "c0db6d6f-f395-4882-8bf4-e644f0e45460",
  user: usersMock[2], // Dad
  message: "Looking great Izzy, keep it up! 💪",
  createdAt,
  updatedAt,
};

export const commentMock5: Comment = {
  id: "6c57eff9-f310-470a-b8e9-0f5234b63f5a",
  user: usersMock[0], // Izzy
  message: "Done! Can I have 10 minutes of tablet time? 🤞",
  parentId: "ee000718-85e5-44ac-91e2-e29340fb0b61", // Reply to commentMock3
  createdAt,
  updatedAt,
};
