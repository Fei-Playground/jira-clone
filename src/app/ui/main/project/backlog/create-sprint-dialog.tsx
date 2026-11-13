import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import cx from "classix";
import { AiOutlinePlus } from "react-icons/ai";
import {
  SPRINT_DEFAULT_LENGTH_IN_DAYS,
  Sprint,
  getNextSprint,
} from "@domain/sprint";
import { Button } from "@app/components/button";
import * as Dialog from "@app/components/dialog";
import { ActionData } from "@app/routes/__main/projects.$projectId/backlog";
import { addDays, toDateInputValue } from "@utils/date";

const labelClass =
  "mb-1 block font-primary-light text-2xs uppercase text-font-subtlest";

const inputClass = cx(
  "w-full rounded-md border-none bg-background-input p-3 text-font",
  "outline outline-2 outline-border-input duration-200 ease-in-out",
  "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
  "focus:bg-background-input-pressed focus:outline-border-brand"
);

const errorClass = "ml-3 font-primary-light text-sm text-font-danger";

/** The dates a new sprint starts on: the next one already planned, or the coming fortnight. */
const getSuggestedSprintDates = (sprints: Sprint[]): SprintDates => {
  const nextSprint = getNextSprint(sprints);

  if (nextSprint) {
    return { startDate: nextSprint.startDate, endDate: nextSprint.endDate };
  }

  const startDate = Date.now();

  return {
    startDate,
    endDate: addDays(startDate, SPRINT_DEFAULT_LENGTH_IN_DAYS),
  };
};

export const CreateSprintDialog = ({ sprints }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dates, setDates] = useState<SprintDates | null>(null);
  const wasSubmitting = useRef<boolean>(false);
  const fetcher = useFetcher();
  const actionData = fetcher.data as ActionData | undefined;
  const errors = actionData?.errors;
  const isSubmitting = fetcher.state !== "idle";

  const handleOpenChange = (open: boolean): void => {
    if (open) {
      setDates(getSuggestedSprintDates(sprints));
    }
    setIsOpen(open);
  };

  useEffect(() => {
    if (wasSubmitting.current && !isSubmitting && !errors) {
      setIsOpen(false);
    }
    wasSubmitting.current = isSubmitting;
  }, [isSubmitting, errors]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button color="neutral" variant="subtlest">
          <AiOutlinePlus size={18} />
          Create sprint
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[520px]">
            <Dialog.Title>Create sprint</Dialog.Title>
            <Dialog.Description className="font-primary-light text-sm text-font-subtle">
              Give the sprint a name and the days it runs. It becomes the
              current sprint on its start date.
            </Dialog.Description>
            <fetcher.Form method="post" className="mt-6">
              <div className="mb-4">
                <label htmlFor="sprint-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="sprint-name"
                  name="name"
                  type="text"
                  maxLength={60}
                  placeholder="Sprint 3"
                  className={cx(
                    inputClass,
                    errors?.name &&
                      "outline-border-danger focus-visible:outline-border-danger"
                  )}
                />
                {errors?.name && (
                  <span className={errorClass}>{errors.name}</span>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex-grow">
                  <label htmlFor="sprint-start-date" className={labelClass}>
                    Start date
                  </label>
                  <input
                    id="sprint-start-date"
                    name="startDate"
                    type="date"
                    defaultValue={
                      dates ? toDateInputValue(dates.startDate) : undefined
                    }
                    className={cx(
                      inputClass,
                      errors?.startDate &&
                        "outline-border-danger focus-visible:outline-border-danger"
                    )}
                  />
                  {errors?.startDate && (
                    <span className={errorClass}>{errors.startDate}</span>
                  )}
                </div>
                <div className="flex-grow">
                  <label htmlFor="sprint-end-date" className={labelClass}>
                    End date
                  </label>
                  <input
                    id="sprint-end-date"
                    name="endDate"
                    type="date"
                    defaultValue={
                      dates ? toDateInputValue(dates.endDate) : undefined
                    }
                    className={cx(
                      inputClass,
                      errors?.endDate &&
                        "outline-border-danger focus-visible:outline-border-danger"
                    )}
                  />
                  {errors?.endDate && (
                    <span className={errorClass}>{errors.endDate}</span>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <Button
                  type="button"
                  color="neutral"
                  variant="subtlest"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  name="_action"
                  value="createSprint"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating" : "Create"}
                </Button>
              </div>
            </fetcher.Form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface Props {
  sprints: Sprint[];
}

interface SprintDates {
  startDate: number;
  endDate: number;
}
