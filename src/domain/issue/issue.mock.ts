import { userMock1, usersMock } from "@domain/user";
import {
  commentMock1,
  commentMock2,
  commentMock3,
  commentMock4,
  commentMock5,
} from "@domain/comment";
import { priorityLow, priorityMedium, priorityHigh } from "@domain/priority";
import { Issue } from "./issue";

const createdAt = new Date("2022-01-18 11:00").valueOf();

// PROJECT 1
export const todoIssuesMock1: Issue[] = [
  {
    id: "4db55cbf-222d-424a-b23b-08e61534c706",
    name: "Get up and make your bed",
    description:
      "Start the day right! Make your bed before breakfast. Smooth out the covers and fluff your pillows.",
    reporter: userMock1,
    asignee: userMock1,
    comments: [],
    priority: priorityLow,
    categoryType: "TODO",
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "ea07f7ca-13e9-4143-b623-f5713adef81a",
    name: "Brush teeth & wash face",
    description:
      "Morning hygiene routine. Brush for a full 2 minutes and wash your face with warm water.",
    reporter: usersMock[1], // Mom
    asignee: userMock1,
    comments: [],
    priority: priorityLow,
    categoryType: "TODO",
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "23717058-379a-447a-a215-e425a124154f",
    name: "Eat breakfast & clean up after yourself",
    description:
      "Have a healthy breakfast, then put your dishes in the dishwasher and wipe down the table.",
    reporter: usersMock[1], // Mom
    asignee: userMock1,
    comments: [],
    priority: priorityMedium,
    categoryType: "TODO",
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "cb3eb5e6-299d-4e1a-8521-a5541f8403e4",
    name: "Read for 20 minutes",
    description:
      "Pick any book you love. Reading counts toward your Daily Mission bonus!",
    reporter: usersMock[1], // Mom
    asignee: userMock1,
    comments: [],
    priority: priorityHigh,
    categoryType: "TODO",
    createdAt,
    updatedAt: createdAt,
  },
];

export const inProgressIssuesMock1: Issue[] = [
  {
    id: "8264e3fc-dd97-4abe-9612-deee6472e5c4",
    name: "Put away clothes (floor check!)",
    description:
      "Pick up everything off the floor. Dirty clothes go in the hamper, clean clothes get folded and put away.",
    reporter: usersMock[1], // Mom
    asignee: userMock1,
    comments: [],
    priority: priorityMedium,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "f3efefcf-7859-4241-8b03-4ae815183355",
    name: "Unload the dishwasher",
    description:
      "Put all clean dishes, cups, and silverware in their proper places. Check that everything is actually clean first!",
    reporter: usersMock[1], // Mom
    asignee: userMock1,
    comments: [commentMock3],
    priority: priorityMedium,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: createdAt,
  },
];

export const doneIssuesMock1: Issue[] = [
  {
    id: "812664aa-82be-418b-9ba3-1d7acdcd6be2",
    name: "Fill cat water bowl",
    description:
      "Refill the cat's water bowl with fresh, clean water. Rinse it out first!",
    reporter: usersMock[1], // Mom
    asignee: userMock1,
    comments: [commentMock1, commentMock2],
    priority: priorityLow,
    categoryType: "DONE",
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "6bf6a1f4-20bb-492b-8ea4-4aa18efeb062",
    name: "Scoop the litter box",
    description:
      "Scoop all clumps from the litter box and tie up the bag. Add fresh litter if needed.",
    reporter: usersMock[1], // Mom
    asignee: userMock1,
    comments: [commentMock4, commentMock5],
    priority: priorityHigh,
    categoryType: "DONE",
    createdAt,
    updatedAt: createdAt,
  },
];

// PROJECT 2
export const todoIssuesMock2: Issue[] = [];

export const inProgressIssuesMock2: Issue[] = [];

export const doneIssuesMock2: Issue[] = [];

export const defaultIssuesIds = [
  todoIssuesMock1,
  inProgressIssuesMock1,
  doneIssuesMock1,
  todoIssuesMock2,
  inProgressIssuesMock2,
  doneIssuesMock2,
]
  .flat()
  .map((issue) => issue.id);
