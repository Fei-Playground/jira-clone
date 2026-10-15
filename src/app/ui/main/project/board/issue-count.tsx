import { filterIssues } from "@domain/filter";
import { useProjectStore } from "@app/ui/main/project";

export const IssueCount = (): JSX.Element => {
  const { project, search, priorityFilter } = useProjectStore();
  const issues = project.categories.flatMap((category) => category.issues);
  const matchingIssues = filterIssues(issues, search, priorityFilter).length;

  return (
    <span
      aria-live="polite"
      className="font-primary-light text-2xs text-font-subtlest"
    >
      {formatIssueCount(matchingIssues, issues.length)}
    </span>
  );
};

const formatIssueCount = (
  matchingIssues: number,
  totalIssues: number
): string => {
  if (totalIssues === 0) {
    return "No issues";
  }

  const matchingLabel = issueLabel(matchingIssues);

  if (matchingIssues === totalIssues) {
    return matchingLabel;
  }

  return `${matchingLabel} of ${totalIssues}`;
};

const issueLabel = (count: number): string =>
  `${count} ${count === 1 ? "issue" : "issues"}`;
