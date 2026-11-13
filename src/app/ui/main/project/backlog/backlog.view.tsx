import { Issue } from "@domain/issue";
import { SprintWithIssues } from "@domain/sprint";
import { CreateSprintDialog } from "./create-sprint-dialog";
import { SprintSection } from "./sprint-section";
import { BacklogIssueRow } from "./backlog-issue-row";

export const BacklogView = ({ sprints, backlogIssues }: Props): JSX.Element => (
  // h-0 + flex-grow keeps the page from growing the app shell: the list scrolls inside it
  <div className="flex h-0 min-h-0 flex-grow flex-col gap-6 overflow-y-auto pb-6">
    <section className="flex items-start justify-between gap-6">
      <p className="max-w-[500px] font-primary-light text-sm leading-6 text-font-subtle">
        Plan what the team picks up next. Create a sprint with its name and the
        days it runs, then move issues from the backlog into it. An issue can
        only be in one sprint at a time.
      </p>
      <CreateSprintDialog sprints={sprints} />
    </section>

    {sprints.map((sprint) => (
      <SprintSection key={sprint.id} sprint={sprint} sprints={sprints} />
    ))}

    <section className="rounded-md bg-elevation-surface-sunken p-3">
      <header className="flex items-center gap-3 px-1 pb-2.5">
        <h2 className="font-primary-bold text-lg text-font">Backlog</h2>
        <span className="font-primary-light text-2xs text-font-subtlest">
          ( {backlogIssues.length} )
        </span>
      </header>
      {backlogIssues.length === 0 ? (
        <p className="px-1 py-4 font-primary-light text-xs uppercase text-font-subtlest">
          Nothing left in the backlog
        </p>
      ) : (
        <ul className="space-y-2">
          {backlogIssues.map((issue) => (
            <li key={issue.id}>
              <BacklogIssueRow issue={issue} sprints={sprints} />
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
);

interface Props {
  sprints: SprintWithIssues[];
  backlogIssues: Issue[];
}
