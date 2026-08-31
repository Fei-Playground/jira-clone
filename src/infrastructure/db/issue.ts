import { Prisma } from "@prisma/client";
import { UserId } from "@domain/user";
import { CategoryType, CategoryId } from "@domain/category";
import { IssueId, Issue, IssueActivityType } from "@domain/issue";
import { Priority, PriorityId } from "@domain/priority";
import { Comment } from "@domain/comment";
import { dnull } from "src/utils/dnull";
import { db } from "./db.server";

const mapUser = (user: {
  id: string;
  name: string;
  image: string | null;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}) =>
  dnull({
    ...user,
    ...(user.createdAt
      ? {
          createdAt: user.createdAt.getTime(),
          updatedAt: user.updatedAt?.getTime(),
        }
      : {}),
  });

const mapIssue = (issueDb: {
  id: string;
  name: string;
  description: string | null;
  category: { type: string };
  priority: Priority;
  asignee: {
    id: string;
    name: string;
    image: string | null;
    color: string;
  };
  reporter: {
    id: string;
    name: string;
    image: string | null;
    color: string;
  };
  comments: Array<{
    id: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
      color: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  dueDate: Date | null;
  estimate: string | null;
  timeLogged: string | null;
  watchers: Array<{
    id: string;
    name: string;
    image: string | null;
    color: string;
  }>;
  activities: Array<{
    id: string;
    type: string;
    message: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
      color: string;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}): Issue => ({
  id: issueDb.id,
  name: issueDb.name,
  description: issueDb.description || undefined,
  categoryType: issueDb.category.type as CategoryType,
  priority: issueDb.priority as Priority,
  asignee: mapUser(issueDb.asignee),
  reporter: mapUser(issueDb.reporter),
  comments: issueDb.comments.map((comment) => ({
    ...comment,
    createdAt: comment.createdAt.getTime(),
    updatedAt: comment.updatedAt.getTime(),
    user: mapUser(comment.user),
  })),
  dueDate: issueDb.dueDate ? issueDb.dueDate.getTime() : null,
  estimate: issueDb.estimate,
  timeLogged: issueDb.timeLogged,
  watchers: issueDb.watchers.map(mapUser),
  activities: issueDb.activities.map((activity) => ({
    id: activity.id,
    type: activity.type as IssueActivityType,
    message: activity.message,
    createdAt: activity.createdAt.getTime(),
    user: mapUser(activity.user),
  })),
  createdAt: issueDb.createdAt.getTime(),
  updatedAt: issueDb.updatedAt.getTime(),
});

const issueInclude = {
  asignee: true,
  reporter: true,
  category: true,
  priority: true,
  comments: {
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
  watchers: {
    orderBy: {
      name: "asc" as const,
    },
  },
  activities: {
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc" as const,
    },
  },
};

export const getIssue = async (issueId: IssueId): Promise<Issue | null> => {
  const issueDb = await db.issue.findUnique({
    where: {
      id: issueId,
    },
    include: issueInclude,
  });

  if (!issueDb) {
    return null;
  }

  return mapIssue(issueDb as Parameters<typeof mapIssue>[0]);
};

export type CreateIssueInputData = {
  name: string;
  description: string;
  categoryId: CategoryId;
  priority: PriorityId;
  asigneeId: UserId;
  reporterId: UserId;
  comments: Comment[];
  dueDate?: number | null;
  estimate?: string | null;
  timeLogged?: string | null;
  watcherIds?: UserId[];
};

const toDateOrNull = (value?: number | null): Date | null => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return null;
  }
  return new Date(value);
};

export const createIssue = async (issue: CreateIssueInputData): Promise<IssueId> => {
  const watcherIds = issue.watcherIds ?? [];
  const newIssue = await db.issue.create({
    data: {
      name: issue.name,
      description: issue.description,
      categoryId: issue.categoryId,
      priorityId: issue.priority,
      asigneeId: issue.asigneeId,
      reporterId: issue.reporterId,
      dueDate: toDateOrNull(issue.dueDate),
      estimate: issue.estimate || null,
      timeLogged: issue.timeLogged || null,
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
      watchers: {
        connect: watcherIds.map((id) => ({ id })),
      },
      activities: {
        create: [
          {
            type: "created",
            message: "created this issue",
            user: { connect: { id: issue.reporterId } },
          },
          ...issue.comments.map((comment) => ({
            type: "comment_added",
            message: "added a comment",
            user: { connect: { id: comment.user.id } },
          })),
        ],
      },
    },
  });

  return newIssue.id as IssueId;
};

export type UpdateIssueInputData = CreateIssueInputData & {
  id: IssueId;
  actorId?: UserId;
};

type ActivityCreate = {
  type: IssueActivityType;
  message: string;
  userId: UserId;
};

const buildUpdateActivities = async (issue: UpdateIssueInputData): Promise<ActivityCreate[]> => {
  const actorId = issue.actorId || issue.reporterId;
  const previous = await db.issue.findUnique({
    where: { id: issue.id },
    include: {
      category: true,
      priority: true,
      asignee: true,
      watchers: true,
      comments: true,
    },
  });

  if (!previous) {
    return [];
  }

  const activities: ActivityCreate[] = [];

  if (previous.name !== issue.name) {
    activities.push({
      type: "updated",
      message: "updated the title",
      userId: actorId,
    });
  }

  if ((previous.description || "") !== (issue.description || "")) {
    activities.push({
      type: "updated",
      message: "updated the description",
      userId: actorId,
    });
  }

  if (previous.categoryId !== issue.categoryId) {
    const nextCategory = await db.category.findUnique({
      where: { id: issue.categoryId },
    });
    activities.push({
      type: "status_changed",
      message: nextCategory ? `changed status to ${nextCategory.name}` : "changed the status",
      userId: actorId,
    });
  }

  if (previous.priorityId !== issue.priority) {
    activities.push({
      type: "priority_changed",
      message: `changed priority to ${issue.priority}`,
      userId: actorId,
    });
  }

  if (previous.asigneeId !== issue.asigneeId) {
    const nextAssignee = await db.user.findUnique({
      where: { id: issue.asigneeId },
    });
    activities.push({
      type: "assignee_changed",
      message: nextAssignee
        ? `assigned this issue to ${nextAssignee.name}`
        : "changed the assignee",
      userId: actorId,
    });
  }

  const previousDue = previous.dueDate ? previous.dueDate.getTime() : null;
  const nextDue = issue.dueDate ?? null;
  if (previousDue !== nextDue) {
    activities.push({
      type: "due_date_changed",
      message: nextDue
        ? `set due date to ${new Date(nextDue).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}`
        : "cleared the due date",
      userId: actorId,
    });
  }

  if ((previous.estimate || null) !== (issue.estimate || null)) {
    activities.push({
      type: "estimate_changed",
      message: issue.estimate ? `set estimate to ${issue.estimate}` : "cleared the estimate",
      userId: actorId,
    });
  }

  if ((previous.timeLogged || null) !== (issue.timeLogged || null)) {
    activities.push({
      type: "time_logged_changed",
      message: issue.timeLogged ? `logged ${issue.timeLogged}` : "cleared time logged",
      userId: actorId,
    });
  }

  const previousWatcherIds = new Set(previous.watchers.map((w) => w.id));
  const nextWatcherIds = new Set(issue.watcherIds ?? []);

  for (const watcherId of nextWatcherIds) {
    if (!previousWatcherIds.has(watcherId)) {
      const watcher = await db.user.findUnique({ where: { id: watcherId } });
      activities.push({
        type: "watcher_added",
        message: watcher ? `${watcher.name} started watching` : "added a watcher",
        userId: actorId,
      });
    }
  }

  for (const watcherId of previousWatcherIds) {
    if (!nextWatcherIds.has(watcherId)) {
      const watcher = await db.user.findUnique({ where: { id: watcherId } });
      activities.push({
        type: "watcher_removed",
        message: watcher ? `${watcher.name} stopped watching` : "removed a watcher",
        userId: actorId,
      });
    }
  }

  const previousCommentIds = new Set(previous.comments.map((c) => c.id));
  for (const comment of issue.comments) {
    if (!comment.id.startsWith("temp-") && !previousCommentIds.has(comment.id)) {
      // already persisted comments that weren't there — rare
      continue;
    }
    if (comment.id.startsWith("temp-") || !previousCommentIds.has(comment.id)) {
      activities.push({
        type: "comment_added",
        message: "added a comment",
        userId: comment.user.id,
      });
    }
  }

  if (activities.length === 0) {
    activities.push({
      type: "updated",
      message: "updated this issue",
      userId: actorId,
    });
  }

  return activities;
};

export const updateIssue = async (issue: UpdateIssueInputData) => {
  const activities = await buildUpdateActivities(issue);
  const watcherIds = issue.watcherIds ?? [];

  await db.issue.update({
    where: {
      id: issue.id,
    },
    data: {
      name: issue.name,
      description: issue.description,
      categoryId: issue.categoryId,
      priorityId: issue.priority,
      asigneeId: issue.asigneeId,
      reporterId: issue.reporterId,
      dueDate: toDateOrNull(issue.dueDate),
      estimate: issue.estimate || null,
      timeLogged: issue.timeLogged || null,
      watchers: {
        set: watcherIds.map((id) => ({ id })),
      },
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
              id: comment.id.startsWith("temp-") ? undefined : comment.id,
            },
            update: commentInput,
          };
        }),
      },
      activities: {
        create: activities.map((activity) => ({
          type: activity.type,
          message: activity.message,
          user: { connect: { id: activity.userId } },
        })),
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
