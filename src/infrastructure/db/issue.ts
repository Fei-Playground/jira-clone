import { Prisma } from "@prisma/client";
import { UserId } from "@domain/user";
import { CategoryType, CategoryId } from "@domain/category";
import { IssueId, Issue } from "@domain/issue";
import { Priority, PriorityId } from "@domain/priority";
import { Comment, CommentId } from "@domain/comment";
import { dnull } from "src/utils/dnull";
import { db } from "./db.server";

export const getIssue = async (issueId: IssueId): Promise<Issue | null> => {
  const issueDb = await db.issue.findUnique({
    where: {
      id: issueId,
    },
    include: {
      asignee: true,
      reporter: true,
      category: true,
      priority: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!issueDb) {
    return null;
  }

  // Convert all comments to domain format
  const allComments = issueDb.comments.map((c) => ({
    id: c.id as CommentId,
    user: dnull({
      ...c.user,
      createdAt: c.user.createdAt.getTime(),
      updatedAt: c.user.updatedAt.getTime(),
    }),
    message: c.message,
    createdAt: c.createdAt.getTime(),
    updatedAt: c.updatedAt.getTime(),
    parentId: (c.parentId as CommentId | null) || null,
    replies: [] as Comment[],
  }));

  // Group comments into tree structure (max depth 2)
  const topLevel = allComments.filter((c) => !c.parentId);
  topLevel.forEach((parent) => {
    parent.replies = allComments.filter((c) => c.parentId === parent.id);
  });

  const issue: Issue = {
    id: issueDb.id,
    name: issueDb.name,
    description: issueDb.description || undefined,
    categoryType: issueDb.category.type as CategoryType,
    priority: issueDb.priority as Priority,
    asignee: dnull(issueDb.asignee),
    reporter: dnull(issueDb.reporter),
    comments: topLevel,
    createdAt: issueDb.createdAt.getTime(),
    updatedAt: issueDb.updatedAt.getTime(),
  };

  return issue;
};

export type CreateIssueInputData = {
  name: string;
  description: string;
  categoryId: CategoryId;
  priority: PriorityId;
  asigneeId: UserId;
  reporterId: UserId;
  comments: Comment[];
};
export const createIssue = async (issue: CreateIssueInputData): Promise<IssueId> => {
  // Flatten replies into flat comment list with parentId set
  const flatComments = issue.comments.flatMap((c) => [
    { ...c, parentId: c.parentId ?? null },
    ...(c.replies || []).map((r) => ({ ...r, parentId: c.id })),
  ]);

  const newIssue = await db.issue.create({
    data: {
      ...issue,
      priority: undefined,
      priorityId: issue.priority,
      comments: {
        create: flatComments.map((comment) => {
          const commentInput: Omit<Prisma.CommentCreateInput, "issue"> = {
            id: comment.id,
            message: comment.message,
            user: { connect: { id: comment.user.id } },
            parentId: comment.parentId,
          };

          return {
            ...commentInput,
            id: undefined,
          };
        }),
      },
    },
  });

  return newIssue.id as IssueId;
};

export type UpdateIssueInputData = CreateIssueInputData & { id: IssueId };
export const updateIssue = async (issue: UpdateIssueInputData) => {
  // Flatten replies into flat comment list with parentId set
  const flatComments = issue.comments.flatMap((c) => [
    { ...c, parentId: c.parentId ?? null },
    ...(c.replies || []).map((r) => ({ ...r, parentId: c.id })),
  ]);

  await db.issue.update({
    where: {
      id: issue.id,
    },
    data: {
      ...issue,
      priority: undefined,
      priorityId: issue.priority,
      comments: {
        upsert: flatComments.map((comment) => {
          const commentInput: Omit<Prisma.CommentCreateInput, "issue"> = {
            id: comment.id,
            message: comment.message,
            user: { connect: { id: comment.user.id } },
            parentId: comment.parentId,
          };

          return {
            where: { id: comment.id },
            create: {
              ...commentInput,
              id: undefined,
            },
            update: commentInput,
          };
        }),
      },
    },
  });
};

export type UpdateIssueCategoryData = {
  issueId: IssueId;
  categoryId: CategoryId;
};
export const updateIssueCategory = async ({ issueId, categoryId }: UpdateIssueCategoryData) => {
  await db.issue.update({
    where: {
      id: issueId,
    },
    data: {
      category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });
};

export const deleteIssue = async (issueId: IssueId) => {
  await db.issue.delete({
    where: {
      id: issueId,
    },
  });
};
