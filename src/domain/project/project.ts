import { User } from "@domain/user/user";
import { Category } from "@domain/category/category";

export type ProjectId = string;

// Seeded demo projects. They cannot be deleted from the UI.
export const defaultProjectIds: ProjectId[] = ["jira-clone", "second-project"];
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
