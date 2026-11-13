import { Prisma } from "@prisma/client";
import { UserId } from "@domain/user";
import { CategoryType, CategoryId } from "@domain/category";
import { IssueId, Issue } from "@domain/issue";
import { Priority, PriorityId } from "@domain/priority";
import { SprintId } from "@domain/sprint";
import { Sort, DEFAULT_SORT } from "@domain/filter";
import { Comment } from "@domain/comment";
import { dnull } from "src/utils/dnull";
import { db } from "./db.server";

type PrismaIssueSort = Prisma.Enumerable<Prisma.IssueOrderByWithRelationInput>;

/** The order a list of issues is read in, chosen by the `?sortBy=` filter. */
export const getIssueOrderBy = (
  sortIssuesBy: Sort = DEFAULT_SORT
): PrismaIssueSort => {
  const sortByDate: PrismaIssueSort = { createdAt: "desc" };
  const sortByPriority: PrismaIssueSort = { priority: { order: "desc" } };

  // prettier-ignore
  return sortIssuesBy === "date"
    ? [sortByDate, sortByPriority]
    : [sortByPriority, sortByDate];
};

/** The fields every issue summary in the app is built from. */
export const issueSummarySelect = {
  id: true,
  name: true,
  priority: true,
  sprintId: true,
  createdAt: true,
  reporter: true,
  asignee: true,
} satisfies Prisma.IssueSelect;

export type IssueSummaryDb = Prisma.IssueGetPayload<{
  select: typeof issueSummarySelect;
}>;

export const toIssueSummary = (issue: IssueSummaryDb): Issue => ({
  id: issue.id,
  name: issue.name,
  priority: issue.priority as Priority,
  sprintId: issue.sprintId || undefined,
  reporter: dnull(issue.reporter),
  asignee: dnull(issue.asignee),
  comments: [],
  createdAt: issue.createdAt.getTime(),
  updatedAt: issue.createdAt.getTime(),
});

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

export type UpdateIssueSprintData = {
  issueId: IssueId;
  sprintId: SprintId | null;
};
export const updateIssueSprint = async ({ issueId, sprintId }: UpdateIssueSprintData) => {
  await db.issue.update({
    where: {
      id: issueId,
    },
    data: {
      sprint: sprintId
        ? {
            connect: {
              id: sprintId,
            },
          }
        : { disconnect: true },
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
