import { RxValueNone } from "react-icons/rx";
import { ProjectSummary } from "@domain/project";
import { Issue } from "@domain/issue";
import { DEFAULT_BACKLOG_SORT } from "@domain/filter";
import { ScrollArea } from "@app/components/scroll-area";
import { SelectSort } from "@app/ui/main/project";
import { IssueRow } from "./issue-row";

export const BacklogView = ({ project, issues }: Props): JSX.Element => {
  const issueCount = issues.length;

  return (
    <div className="box-border flex h-full flex-col">
      <section className="flex items-center justify-between">
        <span className="font-primary-light text-xs uppercase text-font-subtlest">
          {issueCount} {issueCount === 1 ? "issue" : "issues"}
        </span>
        <SelectSort defaultSort={DEFAULT_BACKLOG_SORT} />
      </section>
      {issueCount === 0 ? (
        <EmptyBacklog />
      ) : (
        <section className="mt-6 min-h-0 flex-1">
          <ScrollArea>
            <ul className="flex flex-col gap-2 pr-4">
              {issues.map((issue) => (
                <li key={issue.id}>
                  <IssueRow issue={issue} projectId={project.id} />
                </li>
              ))}
            </ul>
          </ScrollArea>
        </section>
      )}
    </div>
  );
};

interface Props {
  project: ProjectSummary;
  issues: Issue[];
}

const EmptyBacklog = (): JSX.Element => (
  <div className="mt-12 flex flex-col items-center text-font-subtlest">
    <RxValueNone size={36} />
    <p className="mt-4 font-primary-light text-xs uppercase">No issues found</p>
  </div>
);
