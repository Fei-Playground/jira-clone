import { IssueLink } from "./issue-link";

const createdAt = new Date("2022-01-18 11:00").valueOf();

export const issueLinksMock: IssueLink[] = [
  {
    id: "link-001",
    sourceIssueId: "23717058-379a-447a-a215-e425a124154f",
    targetIssueId: "4db55cbf-222d-424a-b23b-08e61534c706",
    linkType: "BLOCKS",
    createdAt,
  },
  {
    id: "link-002",
    sourceIssueId: "f3efefcf-7859-4241-8b03-4ae815183355",
    targetIssueId: "6bf6a1f4-20bb-492b-8ea4-4aa18efeb062",
    linkType: "RELATES_TO",
    createdAt: new Date("2022-01-20 09:30").valueOf(),
  },
  {
    id: "link-003",
    sourceIssueId: "812664aa-82be-418b-9ba3-1d7acdcd6be2",
    targetIssueId: "23717058-379a-447a-a215-e425a124154f",
    linkType: "RELATES_TO",
    createdAt: new Date("2022-01-19 14:15").valueOf(),
  },
];
