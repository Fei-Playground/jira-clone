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
import * as AlertDialog from "@app/components/alert-dialog";
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
import { Tooltip } from "@app/components/tooltip";
import { PanelHeaderIssue } from "./panel-header-issue";
import { CreateComment } from "./comment/create-comment";
import { ViewComment } from "./comment/view-comment";
import { SelectStatus } from "./select-status";
import { SelectPriority } from "./select-priority";
import { SelectAsignee } from "./select-asignee";
import { CreatedUpdatedAt } from "./created-updated-at";
import { Spinner } from "./spinner";

export const IssuePanel = ({ issue }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState<Comment[]>(issue?.comments || []);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null
  );
  const [showUnsavedWarning, setShowUnsavedWarning] = useState<boolean>(false);

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

  const postData = useCallback(
    (formTarget: HTMLFormElement) => {
      const isExistingIssue = Boolean(issue?.id);
      const formData = new FormData(formTarget);
      const action = isExistingIssue ? "update" : "create";
      formData.set("comments", JSON.stringify(comments));
      formData.set("_action", action);

      fetcher.submit(formData, {
        method: "post",
      });
    },
    [comments, fetcher, issue?.id]
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

  /**
   * Detects if the form has unsaved changes by comparing current form state
   * with the original issue data. Used to prompt the unsaved changes warning dialog.
   */
  const checkUnsavedChanges = (): boolean => {
    if (!formRef.current) return false;

    const formData = new FormData(formRef.current);
    const currentTitle = formData.get("title") as string;
    const currentDescription = formData.get("description") as string;
    const currentStatus = formData.get("status") as string;
    const currentPriority = formData.get("priority") as string;
    const currentAsignee = formData.get("asignee") as string;

    const hasChanges =
      currentTitle !== (issue?.name || "") ||
      currentDescription !== (issue?.description || "") ||
      currentStatus !== (issue?.categoryType || initStatus) ||
      currentPriority !== (issue?.priority.id || "low") ||
      currentAsignee !== (issue?.asignee?.id || user.id) ||
      comments.length !== (issue?.comments || []).length;

    return hasChanges;
  };

  const handleProgrammaticClose = () => {
    if (checkUnsavedChanges()) {
      setShowUnsavedWarning(true);
    } else {
      setIsOpen(false);
    }
  };

  const confirmClose = () => {
    setShowUnsavedWarning(false);
    setIsOpen(false);
  };

  const cancelClose = () => {
    setShowUnsavedWarning(false);
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
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (checkUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  // Navigate away from issue panel after close animation completes (300ms)
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        const previousUrl = location.pathname.split("/issue")[0];
        navigate(previousUrl);
      }, 300);
    }
  }, [isOpen, navigate, location.pathname]);

  // Track submission completion to show toast notifications
  // We use a ref to detect the transition from submitting -> idle with data
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
      <AlertDialog.Root open={showUnsavedWarning}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <AlertDialog.Title>Discard unsaved changes?</AlertDialog.Title>
            <AlertDialog.Description>
              You have unsaved changes that will be lost if you close now. Are
              you sure you want to discard them?
            </AlertDialog.Description>
            <div className="mt-8 flex w-full justify-end gap-4">
              <AlertDialog.Cancel onClick={cancelClose} aria-label="Cancel">
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={confirmClose}
                aria-label="Discard changes"
              >
                Discard
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
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
              />
              <Form method="post" onSubmit={handleFormSumbit} ref={formRef}>
                <div className="grid grid-cols-5 gap-16">
                  <section className="col-span-3">
                    <div className="my-5 -ml-3 mb-6">
                      <Dialog.Title asChild>
                        <Title
                          initTitle={issue?.name || ""}
                          readOnly={userIsNotReporter}
                          error={actionData?.errors?.name}
                        />
                      </Dialog.Title>
                    </div>
                    <p className="font-primary-black text-font">Description</p>
                    <div className="-ml-3 mb-6">
                      <Description
                        initDescription={issue?.description || ""}
                        readOnly={userIsNotReporter}
                      />
                    </div>
                    <div>
                      <p className="font-primary-black text-font">Comments</p>
                      <div>
                        <CreateComment addComment={addComment} />
                      </div>
                      {comments.length === 0 ? (
                        <p className="mt-6 text-sm text-font-subtlest">
                          No comments yet. Be the first to comment!
                        </p>
                      ) : (
                        <ul className="mt-8 space-y-6">
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
                  </section>
                  <section className="col-span-2 space-y-10">
                    <div>
                      <p className="mb-1">Status</p>
                      <SelectStatus
                        initStatus={issue?.categoryType || initStatus}
                      />
                    </div>
                    <div>
                      <p className="mb-1">Priority</p>
                      <SelectPriority
                        initPriority={issue?.priority.id || "low"}
                      />
                    </div>
                    <div>
                      <p className="mb-1">Asignee</p>
                      <SelectAsignee initAsignee={issue?.asignee || user} />
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
                <div className="mt-6 grid grid-cols-3 items-end">
                  <span className="font-primary-light text-2xs text-font-subtlest text-opacity-80">
                    Press <Kbd>Shift</Kbd> + <Kbd>S</Kbd> to accept
                  </span>
                  <div className="flex justify-center">
                    <Tooltip title="Shift+S">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-fit"
                        disabled={transition.state !== "idle"}
                        aria-label="Accept changes"
                      >
                        {transition.state !== "idle" ? (
                          <>
                            Submitting
                            <Spinner />
                          </>
                        ) : (
                          "Accept"
                        )}
                      </Button>
                    </Tooltip>
                  </div>
                  <span className="justify-self-end font-primary-light text-2xs text-font-subtlest text-opacity-80">
                    Press <Kbd>Esc</Kbd> to close
                  </span>
                </div>
              </Form>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      {/* Portal container rendered client-side to avoid SSR hydration mismatch */}
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
