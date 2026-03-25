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

export const commentMock6: Comment = {
  id: "7d68f00a-g411-581b-9cf5-f755e0g36g5c",
  user: usersMock[2], // Buzz Lightyear
  message:
    "This feature is particularly useful for tracking the progress of complex issues across multiple team members.",
  createdAt,
  updatedAt,
};

export const commentMock7: Comment = {
  id: "8e79g11b-h522-692c-ad6f-g866f1h47h6d",
  user: usersMock[4], // Emperor Zurg
  message:
    "Great implementation! The UI is responsive and handles edge cases well.",
  createdAt,
  updatedAt,
};

export const commentMock8: Comment = {
  id: "9f8ah22c-i633-7a3d-be7g-h977g2i58i7e",
  user: usersMock[9], // Andy Davis
  message:
    "The dark mode looks fantastic! Much easier on the eyes during late-night debugging sessions.",
  createdAt,
  updatedAt,
};

export const commentMock9: Comment = {
  id: "ag9bi33d-j744-8b4e-cf8h-i088h3j69j8f",
  user: usersMock[3], // Jessie
  message:
    "I appreciate how the color scheme transitions smoothly between light and dark modes.",
  createdAt,
  updatedAt,
};

export const commentMock10: Comment = {
  id: "bhaaj44e-k855-9c5f-dg9i-j199i4k7ak9g",
  user: usersMock[8], // T-Rex
  message:
    "Performance seems great even with a large number of issues. Scrolling is smooth!",
  createdAt,
  updatedAt,
};
