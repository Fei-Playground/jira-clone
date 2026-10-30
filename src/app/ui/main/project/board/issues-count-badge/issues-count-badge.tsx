import { isIssueMatchingSearch } from "@domain/issue";
import { useProjectStore } from "../project.store";

export const IssuesCountBadge = (): JSX.Element => {
  const { project, search } = useProjectStore();

  const visibleIssuesCount = project.categories.reduce(
    (count, category) =>
      count +
      category.issues.filter((issue) => isIssueMatchingSearch(issue, search))
        .length,
    0
  );

  return (
    <span
      className="ml-2 box-border rounded bg-background-neutral px-2 py-1 font-primary-light text-2xs uppercase text-font-subtlest"
      title="Issues currently visible on the board"
    >
      {visibleIssuesCount} {visibleIssuesCount === 1 ? "issue" : "issues"}
    </span>
  );
};
