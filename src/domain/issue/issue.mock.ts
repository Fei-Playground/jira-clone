import { userMock1, userMock2, usersMock } from "@domain/user/user.mock";
import {
  commentMock1,
  commentMock2,
  commentMock3,
  commentMock4,
  commentMock5,
  commentMock6,
  commentMock7,
  commentMock8,
} from "@domain/comment/comment.mock";
import { priorityLow, priorityMedium, priorityHigh } from "@domain/priority/priority.mock";
import { Issue } from "./issue";

const createdAt = new Date("2022-01-18 11:00").valueOf();

// PROJECT 1
export const todoIssuesMock1: Issue[] = [
  {
    id: "4db55cbf-222d-424a-b23b-08e61534c706",
    name: "HINT: Check network status when navigating to an error page.",
    description:
      'There are two sections on the sidebar that will intentionally throw an error. The section "Server error" will trigger a 500 error response, while "Not found" returns a 404 error. You can check the status response on the browser network tab and see how it is handled on the UI.',
    reporter: userMock1,
    asignee: userMock1,
    comments: [commentMock4, commentMock5],
    priority: priorityMedium,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-23 15:28").valueOf(),
  },
  {
    id: "4332695e-c35a-4a09-a202-cdab0a4ad290",
    name: "Add a due date field to issues",
    description:
      "Reporters should be able to set an optional due date when creating or editing an issue. Show it on the issue card once set so the team can spot upcoming deadlines at a glance.",
    reporter: usersMock[3], // Jessie
    asignee: usersMock[9], // Andy Davis
    comments: [],
    priority: priorityMedium,
    categoryType: "TODO",
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "8fdff4f4-641d-416d-82ec-09d78de62228",
    name: "Add bulk actions to the board (multi-select issues)",
    description:
      "Allow selecting multiple issue cards at once to move them between categories or reassign them in one action, instead of one at a time.",
    reporter: usersMock[2], // Buzz Lightyear
    asignee: usersMock[2], // Buzz Lightyear
    comments: [commentMock6],
    priority: priorityLow,
    categoryType: "TODO",
    createdAt,
    updatedAt: createdAt,
  },
];

export const inProgressIssuesMock1: Issue[] = [
  {
    id: "ea07f7ca-13e9-4143-b623-f5713adef81a",
    name: "HINT: Open two tabs to see events in real time.",
    description:
      "With the same project open in two different tabs, try making some changes on one of them. The result will be reflected instantly on the other. This will happen with every other user with the app open.",
    reporter: userMock1, // Daniel Serrano
    asignee: userMock2, // Woody
    comments: [],
    priority: priorityHigh,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "23717058-379a-447a-a215-e425a124154f",
    name: "HINT: Try to login and interact with different users. ",
    description:
      "This will be reflected on the UI (e. g. which user created and issue or wrote a comment). A user can only see the projects they are assigned to. You can try this by creating a new project at the /projects page. To logout, go to the avatar dropdown (top right).",
    reporter: userMock2, // Woody
    asignee: usersMock[2], // Buzz Lightyear
    comments: [commentMock1, commentMock2],
    priority: priorityHigh,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: new Date("2022-01-23 17:50").valueOf(),
  },
  {
    id: "aba9bec1-0dcd-4e97-88dd-95eef0ef93b0",
    name: "Fix drag-and-drop glitch on Firefox",
    description:
      "Dragging an issue card between columns occasionally snaps back to its original position on Firefox before the category actually updates. Chrome and Safari are unaffected.",
    reporter: usersMock[5], // Mr Potato
    asignee: usersMock[4], // Emperor Zurg
    comments: [commentMock7],
    priority: priorityHigh,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: createdAt,
  },
];

export const doneIssuesMock1: Issue[] = [
  {
    id: "cb3eb5e6-299d-4e1a-8521-a5541f8403e4",
    name: "HINT: Check the URL when filter or navigate. Try navigate directly to the URL.",
    description:
      "All the routing is handled server-side thanks to Remix Run framework. Everytime you apply a filter, a new request is sent, the data is revalidated in the server and the page HTML is resent to the server. This is very useful when sharing a link. The other person will receive the same exact result as you.",
    reporter: userMock1,
    asignee: userMock1,
    comments: [],
    priority: priorityLow,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-23 10:51").valueOf(),
  },
  {
    id: "8264e3fc-dd97-4abe-9612-deee6472e5c4",
    name: "HINT: Try key combinations to execute actions. They are indicated on the UI.",
    description:
      'E. g., try Shift + N on the board page to create a new issue. By default, it will be created under the category "TO DO". Another common key combination is using Shift + S to save changes (try it on this very issue!).',
    reporter: userMock1,
    asignee: userMock1,
    comments: [commentMock3],
    priority: priorityMedium,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-23 02:04").valueOf(),
  },
  {
    id: "0cc44a2e-d3b2-464f-acdc-a179aa2201d3",
    name: "Fix issue card drag ghost image on Firefox",
    description:
      "The drag preview showed a broken image icon instead of the card outline. Swapped to a custom drag layer so the preview renders consistently across browsers.",
    reporter: usersMock[1], // Woody
    asignee: usersMock[1], // Woody
    comments: [commentMock8],
    priority: priorityHigh,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-24 09:15").valueOf(),
  },
];

// PROJECT 2
export const todoIssuesMock2: Issue[] = [
  {
    id: "f3efefcf-7859-4241-8b03-4ae815183355",
    name: "Add and display issue timestamps",
    description:
      "Id should be create automatically on new Issue(). It must be displayed on issue panel, as well as an updatedAt parameter",
    reporter: userMock1,
    asignee: userMock2,
    comments: [],
    priority: priorityMedium,
    categoryType: "TODO",
    createdAt,
    updatedAt: new Date("2022-01-18 11:01").valueOf(),
  },
  {
    id: "6bf6a1f4-20bb-492b-8ea4-4aa18efeb062",
    name: "Add projects section and the ability to create multiple projects",
    description:
      "Router would be needed. Can create and edit project, as well as add users to that particular project",
    reporter: userMock1,
    asignee: userMock1,
    comments: [],
    priority: priorityLow,
    categoryType: "TODO",
    createdAt,
    updatedAt: new Date("2022-01-23 14:28").valueOf(),
  },
];

export const inProgressIssuesMock2: Issue[] = [
  {
    id: "812664aa-82be-418b-9ba3-1d7acdcd6be2",
    name: "Add dark mode",
    description: "",
    reporter: userMock1,
    asignee: userMock1,
    comments: [],
    priority: priorityHigh,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "47c076ae-cb75-442e-a785-f6fff4d51a68",
    name: "Set up CI pipeline for automated tests",
    description:
      "Run type-check, lint and the Playwright suite on every pull request so regressions are caught before merge.",
    reporter: usersMock[1], // Woody
    asignee: userMock1, // Daniel Serrano
    comments: [],
    priority: priorityMedium,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: createdAt,
  },
];

export const doneIssuesMock2: Issue[] = [
  {
    id: "5df09189-c0a1-45d6-bb9d-00313960bea6",
    name: "Set up project structure and initial routing",
    description:
      "Scaffolded the Remix routes for the projects list, board and issue panel, plus the shared layout and sidebar navigation.",
    reporter: userMock1,
    asignee: userMock1,
    comments: [],
    priority: priorityMedium,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-19 09:00").valueOf(),
  },
  {
    id: "c4e89937-1e61-48e5-ad6a-882f2da2509b",
    name: "Invite team members to the project",
    description:
      "Added Woody and Buzz Lightyear as members so they can see and work on this project's board.",
    reporter: userMock1,
    asignee: usersMock[1], // Woody
    comments: [],
    priority: priorityLow,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-20 12:30").valueOf(),
  },
];

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
