import { userMock1, userMock2, usersMock } from "@domain/user";
import {
  commentMock1,
  commentMock2,
  commentMock3,
  commentMock4,
  commentMock5,
  commentMock6,
  commentMock7,
  commentMock8,
  commentMock9,
  commentMock10,
} from "@domain/comment";
import { priorityLow, priorityMedium, priorityHigh } from "@domain/priority";
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
    id: "5ec66dae-333e-535b-c34c-19f72635d817",
    name: "Implement responsive design for mobile devices",
    description:
      "Ensure the application works seamlessly on all mobile devices with proper touch interactions and optimized layouts.",
    reporter: usersMock[2],
    asignee: usersMock[3],
    comments: [commentMock6],
    priority: priorityHigh,
    categoryType: "TODO",
    createdAt,
    updatedAt: new Date("2022-01-24 09:15").valueOf(),
  },
  {
    id: "6fd77ebe-444f-646c-d45d-2a083746e928",
    name: "Add comprehensive unit tests",
    description:
      "Write unit tests for all utility functions and custom hooks to ensure code quality and maintainability.",
    reporter: usersMock[1],
    asignee: usersMock[4],
    comments: [],
    priority: priorityMedium,
    categoryType: "TODO",
    createdAt,
    updatedAt: new Date("2022-01-24 10:30").valueOf(),
  },
  {
    id: "7ae88fcf-555a-757d-e56e-3b194857fa39",
    name: "Optimize database queries",
    description:
      "Profile and optimize slow database queries to improve overall application performance and response times.",
    reporter: usersMock[5],
    asignee: usersMock[2],
    comments: [commentMock7],
    priority: priorityHigh,
    categoryType: "TODO",
    createdAt,
    updatedAt: new Date("2022-01-24 11:45").valueOf(),
  },
  {
    id: "8bf99fdf-666b-868e-f67f-4c2a5968fa4a",
    name: "Update API documentation",
    description:
      "Create comprehensive API documentation with examples for all endpoints and response schemas.",
    reporter: usersMock[3],
    asignee: usersMock[6],
    comments: [],
    priority: priorityLow,
    categoryType: "TODO",
    createdAt,
    updatedAt: new Date("2022-01-24 13:00").valueOf(),
  },
  {
    id: "9cgaaee0-777d-979f-g78g-5d3b6a79fa5b",
    name: "Implement user feedback system",
    description:
      "Add a feedback collection system to gather user insights and suggestions for continuous improvement.",
    reporter: usersMock[0],
    asignee: usersMock[7],
    comments: [commentMock8],
    priority: priorityMedium,
    categoryType: "TODO",
    createdAt,
    updatedAt: new Date("2022-01-24 14:15").valueOf(),
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
    id: "34828169-48ab-558b-b326-f536b235265f",
    name: "Refactor authentication middleware",
    description:
      "Update authentication middleware to support OAuth 2.0 and improve session management security.",
    reporter: usersMock[4],
    asignee: usersMock[5],
    comments: [commentMock9],
    priority: priorityHigh,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: new Date("2022-01-25 08:30").valueOf(),
  },
  {
    id: "45939270-59bc-669c-c437-f647c346376f",
    name: "Implement real-time notifications",
    description:
      "Add WebSocket-based real-time notifications for events like new comments, issue updates, and mentions.",
    reporter: usersMock[6],
    asignee: usersMock[1],
    comments: [commentMock10],
    priority: priorityMedium,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: new Date("2022-01-25 09:45").valueOf(),
  },
  {
    id: "56a4a381-6acd-77ad-d548-f758d457487f",
    name: "Enhance search functionality",
    description:
      "Improve search to support filters by priority, assignee, reporter, and date range with full-text search capabilities.",
    reporter: usersMock[3],
    asignee: usersMock[9],
    comments: [commentMock6],
    priority: priorityMedium,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: new Date("2022-01-25 11:00").valueOf(),
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
    id: "9375f5fd-3eae-8bcf-b723-cfff7583f6d5",
    name: "Setup CI/CD pipeline",
    description:
      "Configure automated testing, building, and deployment pipeline using GitHub Actions.",
    reporter: usersMock[7],
    asignee: usersMock[8],
    comments: [commentMock7],
    priority: priorityHigh,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-20 16:45").valueOf(),
  },
  {
    id: "a486a6af-4fbf-9cda-c834-df0f8694f7e6",
    name: "Create user onboarding flow",
    description:
      "Develop an intuitive onboarding flow for new users with guided tours and helpful tips.",
    reporter: usersMock[9],
    asignee: usersMock[0],
    comments: [commentMock8],
    priority: priorityMedium,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-19 12:30").valueOf(),
  },
  {
    id: "b597b7be-5fcf-ade-d945-ef1f9705f8f7",
    name: "Implement error logging and monitoring",
    description:
      "Set up comprehensive error logging with Sentry and implement performance monitoring.",
    reporter: usersMock[2],
    asignee: usersMock[3],
    comments: [commentMock9],
    priority: priorityHigh,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-18 14:20").valueOf(),
  },
  {
    id: "c6a8c8cf-5ece-bef-ea56-fi2f8816f9f8",
    name: "Add internationalization support",
    description:
      "Implement i18n to support multiple languages including English, Spanish, and French.",
    reporter: usersMock[4],
    asignee: usersMock[5],
    comments: [commentMock10],
    priority: priorityMedium,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-17 10:15").valueOf(),
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
    description: "Implement complete dark mode support across the entire application including all UI components.",
    reporter: userMock1,
    asignee: userMock1,
    comments: [commentMock6, commentMock8],
    priority: priorityHigh,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: new Date("2022-01-25 18:00").valueOf(),
  },
  {
    id: "923775bb-93cf-529c-aca4-2e8bdeee7cf3",
    name: "Performance optimization for large datasets",
    description:
      "Optimize rendering and data handling for projects with thousands of issues using virtualization techniques.",
    reporter: usersMock[5],
    asignee: usersMock[6],
    comments: [commentMock10],
    priority: priorityMedium,
    categoryType: "IN_PROGRESS",
    createdAt,
    updatedAt: new Date("2022-01-25 17:30").valueOf(),
  },
];

export const doneIssuesMock2: Issue[] = [
  {
    id: "a34886cc-a4da-63ad-bda5-3f9ceffff4d4",
    name: "Migrate to new database schema",
    description:
      "Successfully migrated all data to the new normalized database schema with zero downtime.",
    reporter: usersMock[7],
    asignee: usersMock[8],
    comments: [commentMock7],
    priority: priorityHigh,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-16 11:00").valueOf(),
  },
  {
    id: "b45997dd-b5ea-74be-ceba-4fa0dfb00e5e5",
    name: "Implement two-factor authentication",
    description:
      "Added TOTP-based two-factor authentication with backup codes for enhanced security.",
    reporter: usersMock[9],
    asignee: usersMock[0],
    comments: [commentMock9],
    priority: priorityHigh,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-15 09:30").valueOf(),
  },
  {
    id: "c56aa8ee-c6fa-85cf-dfaa-5hb1efh11f6f6",
    name: "Create comprehensive testing suite",
    description:
      "Developed end-to-end test suite covering all critical user workflows with 85% code coverage.",
    reporter: usersMock[1],
    asignee: usersMock[2],
    comments: [commentMock10],
    priority: priorityMedium,
    categoryType: "DONE",
    createdAt,
    updatedAt: new Date("2022-01-14 14:15").valueOf(),
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
