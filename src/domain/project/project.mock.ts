import { Project } from "./project";
import { usersMock } from "@domain/user";
import { categoriesMock1, categoriesMock2 } from "@domain/category";

export const projectMock1: Project = {
  id: "izzy-independence-board",
  name: "Izzy's Independence Board",
  description: "Freedom grows when responsibility grows.",
  users: usersMock,
  categories: categoriesMock1,
  image: "/images/default-project.png",
  createdAt: new Date("2024-01-01 10:00").valueOf(),
};

export const projectMock2: Project = {
  id: "second-project",
  name: "Second project",
  description:
    "Super long description to test how it clamps on project card in the projects page and in the project sidebar",
  users: usersMock.slice(0, 3), // Only the first 3 users
  categories: categoriesMock2,
  image:
    "https://admin.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10401?size=xxlarge",
  createdAt: new Date("2023-01-01 11:00").valueOf(),
};

export const projectsMock: Project[] = [projectMock1];
