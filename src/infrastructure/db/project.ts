import { Prisma } from "@prisma/client";

import { UserId } from "@domain/user";
import { Project, ProjectSummary, ProjectId } from "@domain/project";
import { Category, CategoryType } from "@domain/category";
import { Sort } from "@domain/filter";
import {
  Sprint,
  isValidSprintFilter,
  sprintFilterToSprintId,
} from "@domain/sprint";
import { db } from "./db.server";
import { dnull } from "src/utils/dnull";
import { getIssueOrderBy, issueSummarySelect, toIssueSummary } from "./issue";
import { getProjectSprints } from "./sprint";

export const getProject = async (
  projectId: ProjectId,
  options?: GetProjectOptions
): Promise<Project | null> => {
  const sprints = await getProjectSprints(projectId);
  const sprintWhere = buildSprintWhere(options?.sprintFilter, sprints);

  const projectDb = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      users: {
        orderBy: {
          name: "asc",
        },
      },
      categories: {
        include: {
          issues: {
            where: sprintWhere,
            select: issueSummarySelect,
            orderBy: getIssueOrderBy(options?.sortIssuesBy),
          },
        },
      },
    },
  });

  if (!projectDb) {
    return null;
  }

  const project: Project = {
    id: projectDb.id,
    users: projectDb.users.map(dnull),
    name: projectDb.name,
    description: projectDb.description || "",
    image: projectDb.image,
    sprints,
    categories: projectDb.categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type as CategoryType,
      order: category.order,
      issues: category.issues.map(toIssueSummary),
    })),
    createdAt: projectDb.createdAt.getDate(),
    updatedAt: projectDb.updatedAt.getDate(),
  };

  return project;
};

interface GetProjectOptions {
  sortIssuesBy?: Sort;
  /** The raw `?sprint=` value: `current`, a sprint id, or anything else to ignore. */
  sprintFilter?: string;
}

/** The issues a sprint filter selects, or no filter at all when it points nowhere. */
const buildSprintWhere = (
  sprintFilter: string | undefined,
  sprints: Sprint[]
): Prisma.IssueWhereInput | undefined => {
  if (!sprintFilter || !isValidSprintFilter(sprintFilter, sprints)) {
    return undefined;
  }

  const sprintId = sprintFilterToSprintId(sprintFilter, sprints);

  return sprintId ? { sprintId } : undefined;
};

export const getProjectSummary = async (projectId: ProjectId): Promise<ProjectSummary | null> => {
  const projectSummaryDb = await db.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      createdAt: true,
    },
  });

  if (!projectSummaryDb) {
    return null;
  }

  const projectSummary: ProjectSummary = {
    id: projectSummaryDb.id,
    name: projectSummaryDb.name,
    description: projectSummaryDb.description || "",
    image: projectSummaryDb.image,
    createdAt: projectSummaryDb.createdAt.getDate(),
  };

  return projectSummary;
};

export const getProjectsSummary = async (userId: UserId): Promise<ProjectSummary[]> => {
  const projectsSummaryDb = await db.project.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const projectsSummary: ProjectSummary[] = projectsSummaryDb.map((projectSummaryDb) => ({
    id: projectSummaryDb.id,
    name: projectSummaryDb.name,
    image: projectSummaryDb.image,
    description: projectSummaryDb.description || "",
    createdAt: projectSummaryDb.createdAt.getDate(),
  }));

  return projectsSummary;
};

type CreateProjectInput = {
  name: string;
  description: string;
  image: string;
  userIds: UserId[];
  categories: Omit<Category, "id">[];
};
export const createProject = async (project: CreateProjectInput): Promise<void> => {
  await db.project.create({
    data: {
      name: project.name,
      description: project.description,
      image: project.image,
      categories: {
        create: project.categories.map((category) => ({
          name: category.name,
          type: category.type,
          order: category.order,
        })),
      },
      users: {
        connect: project.userIds.map((userId) => ({ id: userId })),
      },
    },
    include: {
      categories: true,
      users: true,
    },
  });
};

export const deleteProject = async (projectId: ProjectId): Promise<void> => {
  await db.project.delete({
    where: {
      id: projectId,
    },
  });
};
