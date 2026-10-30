import { Form, Link, useLocation } from "react-router";
import * as AlertDialog from "@app/components/alert-dialog";
import cx from "classix";
import { MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { IssueId } from "@domain/issue";
import { TaskIcon } from "@app/components/icons";

export const PanelHeaderIssue = ({
  id,
  deleteDisabled,
  copyDisabled,
}: PanelHeaderIssueProps): JSX.Element => {
  const location = useLocation();
  const previousUrl = location.pathname.split("/issue")[0];

  return (
    <div className="flex">
      <span className="flex flex-grow items-center">
        <span className="flex items-center">
          <TaskIcon size={20} />
        </span>
        <span className="ml-1 text-font-subtlest text-opacity-80">{id}</span>
      </span>
      <CopyIssueLinkButton disabled={copyDisabled} />
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
  copyDisabled?: boolean;
}

const CopyIssueLinkButton = ({
  disabled,
}: CopyIssueLinkButtonProps): JSX.Element => {
  const location = useLocation();

  const handleCopyLink = (): void => {
    const issueLink = `${window.location.origin}${location.pathname}`;

    navigator.clipboard
      .writeText(issueLink)
      .then(() => toast.success("Issue link copied to clipboard"))
      .catch(() => toast.error("Could not copy the issue link"));
  };

  return (
    <button
      type="button"
      onClick={handleCopyLink}
      className={cx(
        "mx-3 flex rounded border-none p-1.5 flex-center",
        disabled
          ? "cursor-not-allowed text-icon-disabled"
          : "cursor-pointer text-icon hover:bg-background-neutral hover:text-icon-brand"
      )}
      aria-label="Copy issue link"
      disabled={disabled}
      title={
        disabled
          ? "The link is available once the issue is created"
          : "Copy link"
      }
    >
      <MdContentCopy size={22} />
    </button>
  );
};

interface CopyIssueLinkButtonProps {
  disabled?: boolean;
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
            to remove this issue completely?
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
