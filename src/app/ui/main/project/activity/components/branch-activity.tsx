import { BiGitBranch, BiGitPullRequest } from "react-icons/bi";
import { BranchDetail, PullRequestDetail } from "@domain/activity";
import { UserAvatar } from "@app/components/user-avatar";
import { PR_STATUS_CONFIG } from "../activity-timeline.const";
import { Badge } from "./activity-type-badge";
import { MetaRow, ViewDetailButton } from "./activity-parts";

export const BranchActivity = ({
  branch,
  onViewDetail,
}: BranchActivityProps): JSX.Element => (
  <div className="flex flex-col gap-2">
    <p className="font-primary-bold text-sm text-font">
      {branch.action} {branch.branch}
    </p>

    <div className="flex flex-wrap items-center gap-2">
      <Badge className="bg-background-info text-font-info">
        <BiGitBranch size={12} />
        {branch.branch}
      </Badge>
      {branch.baseBranch && (
        <span className="text-xs text-font-subtlest">
          from {branch.baseBranch}
        </span>
      )}
    </div>

    <ViewDetailButton label="View Branch" onClick={onViewDetail} />
  </div>
);

interface BranchActivityProps {
  branch: BranchDetail;
  onViewDetail: () => void;
}

export const PullRequestActivity = ({
  pullRequest,
  onViewDetail,
}: PullRequestActivityProps): JSX.Element => {
  const status = PR_STATUS_CONFIG[pullRequest.status];

  return (
    <div className="flex flex-col gap-2">
      <p className="font-primary-bold text-sm text-font">
        {pullRequest.action} #{pullRequest.number}
      </p>
      <p className="text-sm text-font-subtle">{pullRequest.title}</p>

      <div className="flex flex-wrap items-center gap-2">
        <Badge className={status.className}>{status.label}</Badge>
        <Badge className="bg-background-info text-font-info">
          <BiGitPullRequest size={12} />
          {pullRequest.branch}
        </Badge>
      </div>

      <MetaRow>
        <span className="flex items-center gap-2">
          Reviewers
          <span className="flex items-center gap-1">
            {pullRequest.reviewers.map((reviewer) => (
              <UserAvatar key={reviewer.id} {...reviewer} size={20} tooltip />
            ))}
          </span>
        </span>
      </MetaRow>

      <ViewDetailButton label="View Pull Request" onClick={onViewDetail} />
    </div>
  );
};

interface PullRequestActivityProps {
  pullRequest: PullRequestDetail;
  onViewDetail: () => void;
}
