export type IssueLinkId = string;

export type LinkType = "BLOCKS" | "BLOCKED_BY" | "RELATES_TO" | "DUPLICATES" | "DUPLICATED_BY";

export interface IssueLink {
  id: IssueLinkId;
  sourceIssueId: string;
  targetIssueId: string;
  linkType: LinkType;
  createdAt: number;
}

export const linkTypeLabels: Record<LinkType, string> = {
  BLOCKS: "blocks",
  BLOCKED_BY: "is blocked by",
  RELATES_TO: "relates to",
  DUPLICATES: "duplicates",
  DUPLICATED_BY: "is duplicated by",
};
