import { useState } from "react";
import { Form, Link, useLocation } from "react-router";
import * as AlertDialog from "@app/components/alert-dialog";
import cx from "classix";
import { MdDeleteOutline } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { IssueId } from "@domain/issue";
import { TaskIcon } from "@app/components/icons";
import { Tooltip } from "@app/components/tooltip";

export const PanelHeaderIssue = ({
  id,
  deleteDisabled,
}: PanelHeaderIssueProps): JSX.Element => {
  const location = useLocation();
  const previousUrl = location.pathname.split("/issue")[0];
  const [showCopied, setShowCopied] = useState<boolean>(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setShowCopied(true);
      // Reset tooltip to default after 2 seconds
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy issue ID:", err);
    }
  };

  return (
    <div className="flex">
      <span className="flex flex-grow items-center">
        <span className="flex items-center">
          <TaskIcon size={20} />
        </span>
        <Tooltip title={showCopied ? "Copied!" : "Click to copy ID"}>
          <button
            onClick={handleCopyClick}
            className="ml-1 cursor-pointer text-font-subtlest text-opacity-80 hover:text-opacity-100 hover:underline"
            aria-label="Copy issue ID"
          >
            {id}
          </button>
        </Tooltip>
      </span>
      <DeleteIssueModalDialog disabled={deleteDisabled} />
      <Link
        to={previousUrl}
        className="ml-3 flex cursor-pointer rounded border-none p-0.5 text-icon flex-center hover:bg-background-neutral"
        aria-label="Close issue panel"
      >
        <IoCloseOutline size={32} />
      </Link>
    </div>
  );
};

interface PanelHeaderIssueProps {
  id: IssueId;
  deleteDisabled?: boolean;
}

const DeleteIssueModalDialog = ({
  disabled,
}: DeleteIssueModalDialogProps): JSX.Element => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger
        className={cx(
          "flex rounded border-none p-1.5 text-icon flex-center",
          disabled
            ? "cursor-not-allowed hover:text-font-disabled"
            : "hover:bg-background-danger hover:text-font-danger"
        )}
        aria-label="Open delete issue dialog"
        disabled={disabled}
        title={disabled ? "This user cannot delete the issue" : "Delete issue"}
      >
        <MdDeleteOutline size={26} />
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Title>Delete issue?</AlertDialog.Title>
          <AlertDialog.Description>
            This action is permanent and cannot be undone. Are you sure you want
            to delete this issue completely?
          </AlertDialog.Description>
          <Form method="delete" className="mt-8 flex w-full justify-end gap-4">
            <AlertDialog.Cancel aria-label="Cancel">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
              name="_action"
              value="delete"
              type="submit"
              aria-label="Delete issue"
            >
              Delete
            </AlertDialog.Action>
          </Form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

interface DeleteIssueModalDialogProps {
  disabled?: boolean;
}
