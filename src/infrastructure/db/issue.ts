import { Prisma } from "@prisma/client";
import { UserId } from "@domain/user";
import { CategoryType, CategoryId } from "@domain/category";
import { IssueId, Issue } from "@domain/issue";
import { Priority, PriorityId } from "@domain/priority";
import { ProjectId } from "@domain/project";
import { Sort } from "@domain/filter";
import { Comment } from "@domain/comment";
import { dnull } from "src/utils/dnull";
import { getIssueOrderBy } from "./issue-order";
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

export type GetBacklogIssuesOptions = {
  sortIssuesBy: Sort;
};
export const getBacklogIssues = async (
  projectId: ProjectId,
  options?: GetBacklogIssuesOptions
): Promise<Issue[]> => {
  const issuesDb = await db.issue.findMany({
    where: {
      category: {
        projectId,
      },
    },
    select: {
      id: true,
      name: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
      reporter: true,
      asignee: true,
      category: {
        select: {
          type: true,
        },
      },
    },
    orderBy: getIssueOrderBy(options?.sortIssuesBy),
  });

  return issuesDb.map((issueDb) => ({
    id: issueDb.id,
    name: issueDb.name,
    priority: issueDb.priority as Priority,
    reporter: dnull(issueDb.reporter),
    asignee: dnull(issueDb.asignee),
    comments: [],
    categoryType: issueDb.category.type as CategoryType,
    createdAt: issueDb.createdAt.getTime(),
    updatedAt: issueDb.updatedAt.getTime(),
  }));
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
