import { IssueLink, linkTypeLabels } from "@domain/issue-link";
import { Issue } from "@domain/issue";
import cx from "classix";

export const IssueLinks = ({ links, allIssues }: Props): JSX.Element => {
  if (!links || links.length === 0) {
    return (
      <div className="text-2xs text-font-subtle">
        No linked issues
      </div>
    );
  }

  const getLinkedIssue = (issueId: string): Issue | undefined => {
    return allIssues.find((issue) => issue.id === issueId);
  };

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const linkedIssue = getLinkedIssue(link.targetIssueId);
        if (!linkedIssue) return null;

        return (
          <div key={link.id} className="flex flex-col gap-1 rounded-md bg-background-neutral-subtlest p-2">
            <p className="text-2xs font-primary-light text-font-subtle">
              {linkTypeLabels[link.linkType]}
            </p>
            <p className="line-clamp-2 text-xs text-font">
              {linkedIssue.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

interface Props {
  links?: IssueLink[];
  allIssues: Issue[];
}
