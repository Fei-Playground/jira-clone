import { useState, useEffect, useRef, useCallback } from "react";
import {
  Form,
  useActionData,
  useSearchParams,
  useFetcher,
  useLocation,
  useNavigate,
} from "react-router";
import * as Dialog from "@app/components/dialog";
import * as AlertDialog from "@app/components/alert-dialog";
import { toast } from "react-toastify";
import { MdLockOutline } from "react-icons/md";
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
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import { PanelHeaderIssue } from "./panel-header-issue";
import { CreateComment } from "./comment/create-comment";
import { ViewComment } from "./comment/view-comment";
import { SelectStatus } from "./select-status";
import { SelectPriority } from "./select-priority";
import { SelectAsignee } from "./select-asignee";
import { CreatedUpdatedAt } from "./created-updated-at";
import { Spinner } from "./spinner";

export const IssuePanel = ({ issue }: Props): JSX.Element => {
  const isExistingIssue = Boolean(issue?.id);
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState<Comment[]>(issue?.comments || []);
  const [isDirty, setIsDirty] = useState(!isExistingIssue);
  const [titleValue, setTitleValue] = useState(issue?.name || "");
  const [titleTouched, setTitleTouched] = useState(false);
  const [showUnsavedCloseDialog, setShowUnsavedCloseDialog] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null
  );
  const { user } = useUserStore();
  const reporter = issue ? issue.reporter : user;
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData() as IssueActionData;
  const fetcher = useFetcher();
  const params = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initStatus = (params[0].get("category") as CategoryType) || "TODO";
  const userIsNotReporter = user.id !== reporter.id;
  const isSubmitting = fetcher.state !== "idle";
  const primaryActionLabel = isExistingIssue ? "Save" : "Create";
  const unsavedCommentsCount = comments.filter((comment) =>
    comment.id.startsWith("temp-")
  ).length;

  const titleError =
    titleTouched || actionData?.errors?.name
      ? titleValue.length === 0 || textAreOnlySpaces(titleValue)
        ? actionData?.errors?.name || "Title is required"
        : undefined
      : undefined;

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const postData = useCallback(
    (formTarget: HTMLFormElement) => {
      setTitleTouched(true);
      if (titleValue.length === 0 || textAreOnlySpaces(titleValue)) {
        return;
      }

      const formData = new FormData(formTarget);
      const action = isExistingIssue ? "update" : "create";
      formData.set("comments", JSON.stringify(comments));
      formData.set("_action", action);

      setIsDirty(false);
      fetcher.submit(formData, {
        method: "post",
      });
    },
    [comments, fetcher, isExistingIssue, titleValue]
  );

  const handleProgrammaticSubmit = useCallback((): void => {
    if (userIsNotReporter || isSubmitting) return;
    if (formRef.current) {
      postData(formRef.current);
    }
  }, [isSubmitting, postData, userIsNotReporter]);

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

  const closePanel = () => {
    setIsOpen(false);
  };

  const handleProgrammaticClose = () => {
    if (isDirty && !userIsNotReporter) {
      setShowUnsavedCloseDialog(true);
      return;
    }
    closePanel();
  };

  const addComment = (newComment: Comment): void => {
    setComments((prev) => [...prev, newComment]);
    markDirty();
  };

  const removeComment = (commentId: CommentId): void => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    markDirty();
  };

  const updateComment = (commentId: CommentId, message: string): void => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, message, updatedAt: Date.now() }
          : comment
      )
    );
    markDirty();
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
      if (formAction === "create") {
        toast.success("Issue created successfully");
      } else if (formAction === "update") {
        toast.success("Issue updated successfully");
      }
      wasSubmitting.current = false;
    }
  }, [fetcher.state, fetcher.data, fetcher.formData]);

  return (
    <>
      <Dialog.Root open={true}>
        <Dialog.Portal container={portalContainer}>
          <Dialog.Overlay>
            <Dialog.Content
              onEscapeKeyDown={handleProgrammaticClose}
              onPointerDownOutside={handleProgrammaticClose}
              className={isOpen ? "" : "translate-y-[10px] opacity-0"}
            >
              <PanelHeaderIssue
                id={issue?.id || "Create new issue"}
                deleteDisabled={
                  userIsNotReporter ||
                  defaultIssuesIds.includes(issue?.id || "")
                }
                onClose={handleProgrammaticClose}
              />
              {userIsNotReporter && (
                <div
                  className="mt-4 flex items-center gap-2 rounded bg-background-warning px-3 py-2 text-sm text-font-warning"
                  role="status"
                >
                  <MdLockOutline size={18} aria-hidden />
                  <span>
                    Only the reporter can edit this issue. You can still add
                    comments.
                  </span>
                </div>
              )}
              {isDirty && !userIsNotReporter && (
                <div
                  className="mt-4 flex items-center justify-between gap-3 rounded bg-background-info px-3 py-2 text-sm text-font-info"
                  role="status"
                >
                  <span>You have unsaved changes</span>
                  <span className="font-primary-light text-2xs text-opacity-80">
                    Press <Kbd>Shift</Kbd> + <Kbd>S</Kbd> to{" "}
                    {primaryActionLabel.toLowerCase()}
                  </span>
                </div>
              )}
              <Form method="post" onSubmit={handleFormSumbit} ref={formRef}>
                <div className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-16">
                  <section className="md:col-span-3">
                    <div className="my-5 -ml-3 mb-6">
                      <Dialog.Title asChild>
                        <Title
                          initTitle={issue?.name || ""}
                          readOnly={userIsNotReporter}
                          error={titleError}
                          onValueChange={(value) => {
                            setTitleValue(value);
                            markDirty();
                          }}
                          onTouched={() => setTitleTouched(true)}
                          readOnlyReason="Only the reporter can edit the title"
                        />
                      </Dialog.Title>
                    </div>
                    <div className="mb-1 flex items-center gap-2">
                      <p className="font-primary-black text-font">
                        Description
                      </p>
                      {!userIsNotReporter && (
                        <span className="font-primary-light text-2xs text-font-subtlest">
                          Optional
                        </span>
                      )}
                    </div>
                    <div className="-ml-3 mb-6">
                      <Description
                        initDescription={issue?.description || ""}
                        readOnly={userIsNotReporter}
                        onValueChange={markDirty}
                        readOnlyReason="Only the reporter can edit the description"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <p className="font-primary-black text-font">Comments</p>
                        {comments.length > 0 && (
                          <span className="rounded-full bg-background-neutral px-2 py-0.5 text-2xs text-font-subtlest">
                            {comments.length}
                          </span>
                        )}
                      </div>
                      {unsavedCommentsCount > 0 && !userIsNotReporter && (
                        <p className="mt-1 font-primary-light text-2xs text-font-warning">
                          {unsavedCommentsCount === 1
                            ? "1 new comment"
                            : `${unsavedCommentsCount} new comments`}{" "}
                          will be saved when you{" "}
                          {primaryActionLabel.toLowerCase()} the issue.
                        </p>
                      )}
                      <div>
                        <CreateComment addComment={addComment} />
                      </div>
                      <ul className="mt-8 space-y-6">
                        {comments.map((comment) => (
                          <li key={comment.id}>
                            <ViewComment
                              comment={comment}
                              removeComment={removeComment}
                              updateComment={updateComment}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                  <section className="space-y-10 md:col-span-2">
                    <div>
                      <p className="mb-1">Status</p>
                      <SelectStatus
                        initStatus={issue?.categoryType || initStatus}
                        disabled={userIsNotReporter}
                        onValueChange={markDirty}
                      />
                    </div>
                    <div>
                      <p className="mb-1">Priority</p>
                      <SelectPriority
                        initPriority={issue?.priority.id || "low"}
                        disabled={userIsNotReporter}
                        onValueChange={markDirty}
                      />
                    </div>
                    <div>
                      <p className="mb-1">Assignee</p>
                      <SelectAsignee
                        initAsignee={issue?.asignee || user}
                        disabled={userIsNotReporter}
                        onValueChange={markDirty}
                      />
                    </div>
                    <div>
                      <p className="mb-1">Reporter</p>
                      <div className="mt-1 flex w-fit items-center gap-2 rounded-full bg-background-neutral py-1 pb-1 pl-1 pr-3.5">
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
                <div className="mt-6 grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
                  <span className="font-primary-light text-2xs text-font-subtlest text-opacity-80 sm:justify-self-start">
                    Press <Kbd>Shift</Kbd> + <Kbd>S</Kbd> to{" "}
                    {primaryActionLabel.toLowerCase()}
                  </span>
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-fit"
                      disabled={
                        isSubmitting ||
                        userIsNotReporter ||
                        (!isDirty && isExistingIssue)
                      }
                      aria-label={`${primaryActionLabel} issue`}
                    >
                      {isSubmitting ? (
                        <>
                          Saving
                          <Spinner />
                        </>
                      ) : (
                        primaryActionLabel
                      )}
                    </Button>
                  </div>
                  <span className="font-primary-light text-2xs text-font-subtlest text-opacity-80 sm:justify-self-end">
                    Press <Kbd>Esc</Kbd> to close
                  </span>
                </div>
              </Form>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <AlertDialog.Root
        open={showUnsavedCloseDialog}
        onOpenChange={setShowUnsavedCloseDialog}
      >
        <AlertDialog.Portal container={portalContainer}>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <AlertDialog.Title>Discard unsaved changes?</AlertDialog.Title>
            <AlertDialog.Description>
              You have unsaved changes on this issue. If you leave now, those
              changes will be lost.
            </AlertDialog.Description>
            <div className="mt-8 flex w-full justify-end gap-4">
              <AlertDialog.Cancel aria-label="Keep editing">
                Keep editing
              </AlertDialog.Cancel>
              <AlertDialog.Action
                type="button"
                aria-label="Discard changes"
                onClick={() => {
                  setShowUnsavedCloseDialog(false);
                  closePanel();
                }}
              >
                Discard
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
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
