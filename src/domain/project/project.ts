import { User } from "@domain/user";
import { Category } from "@domain/category";
import { Priority, PriorityId } from "@domain/priority";

export type ProjectId = string;
export interface Project {
  id: ProjectId;
  name: string;
  description?: string;
  users: User[];
  categories: Category[];
  image: string;
  createdAt?: number;
  updatedAt?: number;
}

// TODO: Make createdAt and updatedAt mandatory
export type ProjectSummary = Pick<Project, "id" | "name" | "description" | "image" | "createdAt">;

export const projectToProjectSummary = (project: Project): ProjectSummary => ({
  id: project.id,
  name: project.name,
  description: project.description,
  image: project.image,
  createdAt: project.createdAt,
});

/** Priorities used by at least one issue of the project, ordered from lowest to highest. */
export const getPrioritiesInUse = (project: Project): Priority[] => {
  const priorities = new Map<PriorityId, Priority>();

  project.categories.forEach((category) =>
    category.issues.forEach((issue) => {
      priorities.set(issue.priority.id, issue.priority);
    })
  );

  return [...priorities.values()].sort((a, b) => a.order - b.order);
};
