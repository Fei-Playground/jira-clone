import { useState } from "react";
import { BiGitBranch, BiGitCommit } from "react-icons/bi";
import { RiArrowDropDownLine } from "react-icons/ri";
import cx from "classix";
import { CommitDetail } from "@domain/activity";
import { Badge } from "./activity-type-badge";
import { DiffStat, ViewDetailButton } from "./activity-parts";

export const CommitActivity = ({
  commit,
  onViewDetail,
}: CommitActivityProps): JSX.Element => {
  const [isFileListOpen, setIsFileListOpen] = useState<boolean>(false);
  const fileListId = `commit-files-${commit.hash}`;

  return (
    <div className="flex flex-col gap-2">
      <p className="font-primary-bold text-sm text-font">{commit.message}</p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-font-subtlest">
        <span className="flex items-center gap-1 font-primary-bold text-font-subtle">
          <BiGitCommit size={14} />
          {commit.hash}
        </span>
        <span>
          {commit.filesChanged} {commit.filesChanged === 1 ? "file" : "files"}{" "}
          changed
        </span>
        <DiffStat additions={commit.additions} deletions={commit.deletions} />
        <Badge className="bg-background-info text-font-info">
          <BiGitBranch size={12} />
          {commit.branch}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsFileListOpen(!isFileListOpen)}
          aria-expanded={isFileListOpen}
          aria-controls={fileListId}
          className="flex cursor-pointer items-center gap-1 rounded border-none px-1.5 py-1 text-xs text-font-brand hover:bg-background-brand-subtlest-hovered"
        >
          <RiArrowDropDownLine
            size={20}
            className={cx(
              "duration-200 ease-out",
              !isFileListOpen && "-rotate-90"
            )}
          />
          {isFileListOpen ? "Hide files" : `Show ${commit.files.length} files`}
        </button>
        <ViewDetailButton label="View Commit" onClick={onViewDetail} />
      </div>

      {isFileListOpen && (
        <ul
          id={fileListId}
          className="flex flex-col gap-1 rounded bg-elevation-surface-sunken p-2"
        >
          {commit.files.map((file) => (
            <li
              key={file.path}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <span className="truncate font-primary-light text-font-subtle">
                {file.path}
              </span>
              <DiffStat additions={file.additions} deletions={file.deletions} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface CommitActivityProps {
  commit: CommitDetail;
  onViewDetail: () => void;
}
