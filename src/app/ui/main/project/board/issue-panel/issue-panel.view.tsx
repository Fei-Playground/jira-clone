import { useState, useEffect, useRef, useCallback } from "react";
import {
  Form,
  useActionData,
  useSearchParams,
  useNavigation,
  useFetcher,
  useLocation,
  useNavigate,
} from "react-router";
import * as Dialog from "@app/components/dialog";
import { toast } from "react-toastify";
import { CategoryType } from "@domain/category";
import { Issue, defaultIssuesIds } from "@domain/issue";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { ActionData as IssueActionData } from "@app/routes/__main/projects.$projectId/board/issue/$issueId";
import { UserAvatar } from "@app/components/user-avatar";
import { Button } from "@app/components/button";
import { Title } from "@app/components/title";
import { Description } from "@app/components/description";
import { Kbd } from "@app/components/kbd-placeholder";
import { PanelHeaderIssue } from "./panel-header-issue";
import { CreateComment } from "./comment/create-comment";
import { ViewComment } from "./comment/view-comment";
import { SelectStatus } from "./select-status";
import { SelectPriority } from "./select-priority";
import { SelectAsignee } from "./select-asignee";
import { DueDateField } from "./due-date-field";
import { EstimateField } from "./estimate-field";
import { WatchersField } from "./watchers-field";
import { ActivityTimeline } from "./activity-timeline";
import { CreatedUpdatedAt } from "./created-updated-at";
import { Spinner } from "./spinner";

export const IssuePanel = ({ issue }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState<Comment[]>(issue?.comments || []);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null
  );
  const { user } = useUserStore();
  const reporter = issue ? issue.reporter : user;
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData() as IssueActionData;
  const fetcher = useFetcher();
  const params = useSearchParams();
  const transition = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();
  const initStatus = (params[0].get("category") as CategoryType) || "TODO";
  const userIsNotReporter = user.id !== reporter.id;
  const isSubmitting = fetcher.state !== "idle" || transition.state !== "idle";

  const postData = useCallback(
    (formTarget: HTMLFormElement) => {
      const isExistingIssue = Boolean(issue?.id);
      const formData = new FormData(formTarget);
      const action = isExistingIssue ? "update" : "create";
      formData.set("comments", JSON.stringify(comments));
      formData.set("_action", action);
      formData.set("actorId", user.id);

      fetcher.submit(formData, {
        method: "post",
      });
    },
    [comments, fetcher, issue?.id, user.id]
  );

  const handleProgrammaticSubmit = useCallback((): void => {
    if (formRef.current) {
      postData(formRef.current);
    }
  }, [postData]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleProgrammaticSubmit();
      }
    },
    [handleProgrammaticSubmit]
  );

  const handleFormSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postData(e.currentTarget);
  };

  const handleProgrammaticClose = () => {
    setIsOpen(false);
  };

  const addComment = (newComment: Comment): void => {
    setComments([...comments, newComment]);
  };

  const removeComment = (commentId: CommentId): void => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    setComments(updatedComments);
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        const previousUrl = location.pathname.split("/issue")[0];
        navigate(previousUrl);
      }, 300);
    }
  }, [isOpen, navigate, location.pathname]);

  const wasSubmitting = useRef(false);
  useEffect(() => {
    const submitting = fetcher.state !== "idle";
    if (submitting) {
      wasSubmitting.current = true;
      return;
    }
    if (wasSubmitting.current && fetcher.data) {
      const formAction = (fetcher.formData as FormData | undefined)?.get(
        "_action"
      );
      const data = fetcher.data as IssueActionData | undefined;
      if (data?.errors) {
        toast.error(data.errors.name || "Could not save issue. Try again.");
      } else if (formAction === "create") {
        toast.success("Issue created successfully");
      } else if (formAction === "update") {
        toast.success("Issue updated");
      }
      wasSubmitting.current = false;
    }
  }, [fetcher.state, fetcher.data, fetcher.formData]);

  useEffect(() => {
    if (actionData?.errors?.name) {
      toast.error(actionData.errors.name);
    }
  }, [actionData]);

  return (
    <>
      <Dialog.Root open={true}>
        <Dialog.Portal container={portalContainer}>
          <Dialog.Overlay>
            <Dialog.Content
              onEscapeKeyDown={handleProgrammaticClose}
              onPointerDownOutside={handleProgrammaticClose}
              className={isOpen ? "" : "translate-y-[10px] opacity-0"}
              aria-describedby="issue-panel-description"
            >
              <Dialog.Description
                id="issue-panel-description"
                className="sr-only"
              >
                Issue details panel. Edit fields and press Shift+S to save, or
                Escape to close.
              </Dialog.Description>
              <PanelHeaderIssue
                id={issue?.id || "Create new issue"}
                deleteDisabled={
                  userIsNotReporter ||
                  defaultIssuesIds.includes(issue?.id || "")
                }
              />
              <Form
                method="post"
                onSubmit={handleFormSumbit}
                ref={formRef}
                aria-busy={isSubmitting}
              >
                <fieldset
                  disabled={isSubmitting}
                  className="min-w-0 border-0 p-0"
                >
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-16">
                    <section
                      className="md:col-span-3"
                      aria-label="Issue content"
                    >
                      <div className="my-5 -ml-3 mb-6">
                        <Dialog.Title asChild>
                          <Title
                            initTitle={issue?.name || ""}
                            readOnly={userIsNotReporter}
                            error={actionData?.errors?.name}
                          />
                        </Dialog.Title>
                      </div>
                      <p
                        id="description-label"
                        className="font-primary-black text-font"
                      >
                        Description
                      </p>
                      <div className="-ml-3 mb-6">
                        <Description
                          initDescription={issue?.description || ""}
                          readOnly={userIsNotReporter}
                        />
                      </div>
                      <div>
                        <p
                          id="comments-heading"
                          className="font-primary-black text-font"
                        >
                          Comments
                        </p>
                        <div>
                          <CreateComment addComment={addComment} />
                        </div>
                        {comments.length === 0 ? (
                          <p
                            className="mt-6 rounded-md bg-background-neutral px-4 py-6 text-center text-sm text-font-subtlest"
                            role="status"
                          >
                            No comments yet. Start the conversation!
                          </p>
                        ) : (
                          <ul
                            className="mt-8 space-y-6"
                            aria-labelledby="comments-heading"
                          >
                            {comments.map((comment) => (
                              <li key={comment.id}>
                                <ViewComment
                                  comment={comment}
                                  removeComment={removeComment}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {issue && (
                        <div className="mt-10">
                          <ActivityTimeline
                            activities={issue.activities || []}
                          />
                        </div>
                      )}
                    </section>
                    <section
                      className="space-y-8 md:col-span-2 md:space-y-10"
                      aria-label="Issue details"
                    >
                      <div>
                        <p id="status-label" className="mb-1">
                          Status
                        </p>
                        <SelectStatus
                          initStatus={issue?.categoryType || initStatus}
                        />
                      </div>
                      <div>
                        <p id="priority-label" className="mb-1">
                          Priority
                        </p>
                        <SelectPriority
                          initPriority={issue?.priority.id || "low"}
                        />
                      </div>
                      <div>
                        <p id="assignee-label" className="mb-1">
                          Assignee
                        </p>
                        <SelectAsignee initAsignee={issue?.asignee || user} />
                      </div>
                      <DueDateField
                        initDueDate={issue?.dueDate}
                        readOnly={userIsNotReporter}
                      />
                      <EstimateField
                        initEstimate={issue?.estimate}
                        initTimeLogged={issue?.timeLogged}
                        readOnly={userIsNotReporter}
                      />
                      <WatchersField initWatchers={issue?.watchers || []} />
                      <div>
                        <p id="reporter-label" className="mb-1">
                          Reporter
                        </p>
                        <div
                          className="mt-1 flex w-fit items-center gap-2 rounded-full bg-background-neutral py-1 pb-1 pl-1 pr-3.5"
                          aria-labelledby="reporter-label"
                        >
                          <UserAvatar {...reporter} />
                          <input
                            type="hidden"
                            name="reporter"
                            value={reporter.id}
                          />
                          <p className="m-0">{reporter.name}</p>
                        </div>
                      </div>
                      <div>
                        <CreatedUpdatedAt issue={issue} />
                      </div>
                    </section>
                  </div>
                  <div className="mt-6 grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
                    <span className="order-2 font-primary-light text-2xs text-font-subtlest text-opacity-80 sm:order-none">
                      Press <Kbd>Shift</Kbd> + <Kbd>S</Kbd> to accept
                    </span>
                    <div className="order-1 flex justify-center sm:order-none">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-fit"
                        disabled={isSubmitting}
                        aria-label="Accept changes"
                      >
                        {isSubmitting ? (
                          <>
                            Submitting
                            <Spinner />
                          </>
                        ) : (
                          "Accept"
                        )}
                      </Button>
                    </div>
                    <span className="order-3 justify-self-center font-primary-light text-2xs text-font-subtlest text-opacity-80 sm:justify-self-end">
                      Press <Kbd>Esc</Kbd> to close
                    </span>
                  </div>
                </fieldset>
              </Form>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      {/* To avoid hydration issues because a missmatch with the server*/}
      <div
        ref={setPortalContainer}
        className="fixed left-0 top-0 z-50 h-full w-full"
      />
    </>
  );
};

interface Props {
  issue?: Issue;
}
