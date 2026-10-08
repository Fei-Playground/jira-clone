import { Prisma } from "@prisma/client";
import { Sort } from "@domain/filter";

type IssueOrderBy = Prisma.Enumerable<Prisma.IssueOrderByWithRelationInput>;

/**
 * Ordering shared by every issue list the user can sort: the board columns
 * (`getProject`) and the backlog (`getBacklogIssues`). `date` puts the newest
 * issue first, `priority` puts the highest one first, and the remaining field
 * breaks ties. Callers that pass no sort at all keep the priority-first order.
 */
export const getIssueOrderBy = (sortBy?: Sort): IssueOrderBy => {
  const byDate: Prisma.IssueOrderByWithRelationInput = {
    createdAt: "desc",
  };
  const byPriority: Prisma.IssueOrderByWithRelationInput = {
    priority: {
      order: "desc",
    },
  };

  // prettier-ignore
  return sortBy === "date" ? [byDate, byPriority] : [byPriority, byDate];
};
