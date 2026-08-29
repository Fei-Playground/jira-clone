import { useCallback, useEffect, useRef, useState } from "react";

import { Form, useActionData, useFetcher } from "react-router";
import { toast } from "react-toastify";

import * as Dialog from "@app/components/dialog";
import { Button } from "@app/components/button";
import { Description } from "@app/components/description";
import { Kbd } from "@app/components/kbd-placeholder";
import { Title } from "@app/components/title";
import { ActionData as IssueActionData } from "@app/routes/__main/projects.$projectId/board/issue/$issueId";
import { useUserStore } from "@app/store/user.store";
import { Comment, CommentId } from "@domain/comment";
import { Issue } from "@domain/issue";

import { CommentFilters } from "./comment/comment-filters";
import { CreateComment } from "./comment/create-comment";
import { ViewComment } from "./comment/view-comment";
import { CreatedUpdatedAt } from "./created-updated-at";
import { PanelHeaderIssue } from "./panel-header-issue";
import { SelectAsignee } from "./select-asignee";
import { SelectPriority } from "./select-priority";
import { SelectStatus } from "./select-status";
import { Spinner } from "./spinner";

export const IssuePanel = ({ issue }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState<Comment[]>(issue?.comments || []);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | "all">(
    "all"
  );
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null
  ); // Portal container for Dialog portal rendering
  const { user } = useUserStore();
  const reporter = issue ? issue.reporter : user;
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData() as IssueActionData;
  const fetcher = useFetcher();
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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleFilterChange = (
    newSearchText: string,
    newAuthorId: string | "all"
  ): void => {
    setSearchText(newSearchText);
    setSelectedAuthorId(newAuthorId);
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    if (actionData?.status) {
      if (actionData.status === "success") {
        toast.success(actionData.message || "Issue saved successfully");
        // Close dialog after showing toast
        setTimeout(() => {
          handleProgrammaticClose();
        }, 100);
      }
    }
  }, [actionData]);

  const filteredComments = comments.filter((comment) => {
    const matchesSearch = comment.message
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesAuthor =
      selectedAuthorId === "all" || comment.user.id === selectedAuthorId;
    return matchesSearch && matchesAuthor;
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="relative flex max-h-screen max-w-4xl flex-col gap-4">
            <div className="flex items-center justify-between">
              <PanelHeaderIssue issue={issue} />
              <Dialog.Close asChild>
                <Button
                  variant="text"
                  className="h-8 w-8 rounded-sm p-0 text-font-subtlest"
                >
                  ✕
                </Button>
              </Dialog.Close>
            </div>

            <div
              ref={setPortalContainer}
              className="flex flex-1 flex-col gap-6 overflow-y-auto"
            >
              {issue ? (
                <Form
                  ref={formRef}
                  method="post"
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-8"
                >
                  <div>
                    <Title value={issue.name} />
                  </div>

                  <div>
                    <Description value={issue.description} />
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-font">
                      Issue Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectStatus
                        initStatus={issue.categoryType || "TODO"}
                        onChange={() => {
                          // TODO: Update form when using form context
                        }}
                      />
                      <SelectPriority
                        initPriority={issue.priority.id}
                        onChange={() => {
                          // TODO: Update form when using form context
                        }}
                      />
                    </div>

                    <SelectAsignee
                      initAsignee={issue.asignee}
                      onChange={() => {
                        // TODO: Update form when using form context
                      }}
                    />
                  </div>

                  {userIsNotReporter && (
                    <CreatedUpdatedAt
                      createdAt={issue.createdAt}
                      updatedAt={issue.updatedAt}
                    />
                  )}
                </Form>
              ) : (
                <Spinner />
              )}

              <div className="border-border-subtle border-t" />

              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-font">Comments</h3>

                {issue && (
                  <CreateComment
                    issue={issue}
                    onAddComment={addComment}
                    portalContainer={portalContainer}
                  />
                )}

                {issue && (
                  <CommentFilters
                    comments={comments}
                    onFilterChange={handleFilterChange}
                  />
                )}

                <div className="flex flex-col gap-3">
                  {filteredComments.length > 0 ? (
                    filteredComments.map((comment) => (
                      <ViewComment
                        key={comment.id}
                        comment={comment}
                        onRemoveComment={removeComment}
                        portalContainer={portalContainer}
                      />
                    ))
                  ) : (
                    <p className="text-center text-sm text-font-subtle">
                      {searchText || selectedAuthorId !== "all"
                        ? "No comments match the selected filters"
                        : "No comments yet"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-border-subtle border-t pt-4">
              <div className="flex justify-end gap-2">
                <Button
                  variant="text"
                  onClick={handleProgrammaticClose}
                  className="px-4 py-2"
                >
                  Close
                </Button>
                {issue && (
                  <Button
                    type="submit"
                    onClick={handleProgrammaticSubmit}
                    className="flex items-center gap-1"
                  >
                    Save <Kbd letter="S" />
                  </Button>
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface Props {
  issue: Issue | null;
}
