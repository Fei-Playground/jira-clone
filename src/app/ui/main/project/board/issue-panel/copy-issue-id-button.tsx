import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { IssueId } from "@domain/issue";
import { MdContentCopy, MdCheck } from "react-icons/md";
import cx from "classix";

export const CopyIssueIdButton = ({ issueId }: Props): JSX.Element => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(issueId);
    setIsCopied(true);
    toast.success("Issue ID copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  }, [issueId]);

  return (
    <button
      onClick={handleCopy}
      className={cx(
        "flex cursor-pointer items-center gap-1.5 rounded border-none p-1.5 text-icon transition-all",
        isCopied
          ? "bg-background-success-subtler text-font-success"
          : "hover:bg-background-neutral text-icon"
      )}
      aria-label="Copy issue ID"
      title="Copy issue ID to clipboard"
    >
      {isCopied ? (
        <>
          <MdCheck size={20} />
        </>
      ) : (
        <>
          <MdContentCopy size={20} />
        </>
      )}
    </button>
  );
};

interface Props {
  issueId: IssueId;
}
