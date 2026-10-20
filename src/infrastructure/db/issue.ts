import { Prisma } from "@prisma/client";
import { UserId } from "@domain/user";
import { CategoryType, CategoryId } from "@domain/category";
import { BoardLastUpdated, IssueId, Issue } from "@domain/issue";
import { ProjectId } from "@domain/project";
import { Priority, PriorityId } from "@domain/priority";
import { Comment } from "@domain/comment";
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

  const issue: Issue = {
    id: issueDb.id,
    name: issueDb.name,
    description: issueDb.description || undefined,
    categoryType: issueDb.category.type as CategoryType,
    priority: issueDb.priority as Priority,
    asignee: dnull(issueDb.asignee),
    reporter: dnull(issueDb.reporter),
    comments: issueDb.comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.getTime(),
      updatedAt: comment.updatedAt.getTime(),
      user: dnull({
        ...comment.user,
        createdAt: comment.user.createdAt.getTime(),
        updatedAt: comment.user.updatedAt.getTime(),
      }),
    })),
    createdAt: issueDb.createdAt.getTime(),
    updatedAt: issueDb.updatedAt.getTime(),
  };

  return issue;
};

export const getBoardLastUpdated = async (
  projectId: ProjectId
): Promise<BoardLastUpdated | null> => {
  const latestIssue = await db.issue.findFirst({
    where: {
      category: {
        projectId,
      },
    },
    include: {
      updatedBy: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!latestIssue) {
    return null;
  }

  return {
    updatedAt: latestIssue.updatedAt.getTime(),
    user: latestIssue.updatedBy ? dnull(latestIssue.updatedBy) : null,
  };
};

export type CreateIssueInputData = {
  name: string;
  description: string;
  categoryId: CategoryId;
  priority: PriorityId;
  asigneeId: UserId;
  reporterId: UserId;
  /** The user performing the change. */
  updatedById?: UserId;
  comments: Comment[];
};
export const createIssue = async (issue: CreateIssueInputData): Promise<IssueId> => {
  const newIssue = await db.issue.create({
    data: {
      ...issue,
      priority: undefined,
      priorityId: issue.priority,
      comments: {
        create: issue.comments.map((comment) => {
          const commentInput: Omit<Prisma.CommentCreateInput, "issue"> = {
            id: comment.id,
            message: comment.message,
            user: { connect: { id: comment.user.id } },
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
  await db.issue.update({
    where: {
      id: issue.id,
    },
    data: {
      ...issue,
      priority: undefined,
      priorityId: issue.priority,
      comments: {
        upsert: issue.comments.map((comment) => {
          const commentInput: Omit<Prisma.CommentCreateInput, "issue"> = {
            id: comment.id,
            message: comment.message,
            user: { connect: { id: comment.user.id } },
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
  /** The user performing the change. */
  updatedById?: UserId;
};
export const updateIssueCategory = async ({
  issueId,
  categoryId,
  updatedById,
}: UpdateIssueCategoryData) => {
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
      updatedBy: updatedById ? { connect: { id: updatedById } } : undefined,
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
