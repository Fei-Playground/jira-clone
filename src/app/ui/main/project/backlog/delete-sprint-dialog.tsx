import { Form } from "react-router";
import { MdDeleteOutline } from "react-icons/md";
import * as AlertDialog from "@app/components/alert-dialog";
import { Sprint } from "@domain/sprint";

export const DeleteSprintDialog = ({ sprint }: Props): JSX.Element => (
  <AlertDialog.Root>
    <AlertDialog.Trigger
      className="flex rounded border-none p-1.5 text-icon flex-center hover:bg-background-danger hover:text-font-danger"
      aria-label={`Open delete ${sprint.name} dialog`}
      title="Delete sprint"
    >
      <MdDeleteOutline size={20} />
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay />
      <AlertDialog.Content>
        <AlertDialog.Title>Delete sprint?</AlertDialog.Title>
        <AlertDialog.Description>
          The sprint is removed and its issues go back to the backlog. The
          issues themselves are not deleted.
        </AlertDialog.Description>
        <Form method="post" className="mt-8 flex w-full justify-end gap-4">
          <input type="hidden" name="sprintId" value={sprint.id} />
          <AlertDialog.Cancel aria-label="Cancel">Cancel</AlertDialog.Cancel>
          <AlertDialog.Action
            name="_action"
            value="deleteSprint"
            type="submit"
            aria-label="Delete sprint"
          >
            Delete
          </AlertDialog.Action>
        </Form>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

interface Props {
  sprint: Sprint;
}
