import { Sprint as SprintDB } from "@prisma/client";
import { ProjectId } from "@domain/project";
import { Issue } from "@domain/issue";
import { Sprint, SprintId, SprintWithIssues } from "@domain/sprint";
import { db } from "./db.server";
import { getIssueOrderBy, issueSummarySelect, toIssueSummary } from "./issue";

const toSprint = (sprintDb: SprintDB): Sprint => ({
  id: sprintDb.id,
  name: sprintDb.name,
  startDate: sprintDb.startDate.getTime(),
  endDate: sprintDb.endDate.getTime(),
  createdAt: sprintDb.createdAt.getTime(),
  updatedAt: sprintDb.updatedAt.getTime(),
});

export const getProjectSprints = async (
  projectId: ProjectId
): Promise<Sprint[]> => {
  const sprintsDb = await db.sprint.findMany({
    where: { projectId },
    orderBy: { startDate: "asc" },
  });

  return sprintsDb.map(toSprint);
};

export type BacklogData = {
  sprints: SprintWithIssues[];
  backlogIssues: Issue[];
};

/** Everything the backlog page needs: every sprint with its issues, and the issues nobody planned in. */
export const getBacklog = async (
  projectId: ProjectId
): Promise<BacklogData | null> => {
  const projectDb = await db.project.findUnique({
    where: { id: projectId },
    select: {
      sprints: {
        orderBy: { startDate: "asc" },
        include: {
          issues: {
            select: issueSummarySelect,
            orderBy: getIssueOrderBy(),
          },
        },
      },
      categories: {
        select: {
          issues: {
            where: { sprintId: null },
            select: issueSummarySelect,
            orderBy: getIssueOrderBy(),
          },
        },
      },
    },
  });

  if (!projectDb) {
    return null;
  }

  const sprints: SprintWithIssues[] = projectDb.sprints.map((sprintDb) => ({
    ...toSprint(sprintDb),
    issues: sprintDb.issues.map(toIssueSummary),
  }));

  const backlogIssues: Issue[] = projectDb.categories
    .flatMap((category) => category.issues)
    .map(toIssueSummary);

  return { sprints, backlogIssues };
};

export type CreateSprintInput = {
  projectId: ProjectId;
  name: string;
  startDate: number;
  endDate: number;
};
export const createSprint = async (
  sprint: CreateSprintInput
): Promise<SprintId> => {
  const sprintDb = await db.sprint.create({
    data: {
      name: sprint.name,
      startDate: new Date(sprint.startDate),
      endDate: new Date(sprint.endDate),
      project: { connect: { id: sprint.projectId } },
    },
  });

  return sprintDb.id as SprintId;
};

export const deleteSprint = async (sprintId: SprintId): Promise<void> => {
  await db.sprint.delete({
    where: {
      id: sprintId,
    },
  });
};
