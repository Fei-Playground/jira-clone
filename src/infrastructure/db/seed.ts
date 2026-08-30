import {
  Project as ProjectDB,
  User as UserDB,
  Category as CategoryDB,
  Issue as IssueDB,
  Priority as PriorityDB,
} from "@prisma/client";
import { User, usersMock, getRandomPastelColor } from "@domain/user";
import { Project, ProjectId, projectsMock } from "@domain/project";
import { Category, CategoryId } from "@domain/category";
import { Issue } from "@domain/issue";
import { Priority, prioritiesMock } from "@domain/priority";
import { db } from "./db.server";

// Leaving the update empty will not update the record if it already exists
const createUserIfNotExists = async (user: User): Promise<UserDB> => {
  return db.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      name: user.name,
      image: user.image,
      color: user.color || getRandomPastelColor(),
    },
    update: {},
  });
};

const createPriorityIfNotExists = async (priority: Priority): Promise<PriorityDB> => {
  return db.priority.upsert({
    where: { id: priority.id },
    create: {
      id: priority.id,
      name: priority.name,
      order: priority.order,
    },
    update: {},
  });
};

const createProjectIfNotExists = async (project: Project): Promise<ProjectDB> => {
  return db.project.upsert({
    where: { id: project.id },
    create: {
      id: project.id,
      name: project.name,
      description: project.description,
      image: project.image,
      users: {
        connect: project.users.map((user) => ({ id: user.id })),
      },
    },
    update: {},
  });
};

const createCategoryIfNotExists = async (
  category: Category,
  projectId: ProjectId
): Promise<CategoryDB> => {
  return db.category.upsert({
    where: { id: category.id },
    create: {
      id: category.id,
      type: category.type,
      name: category.name,
      order: category.order,
      project: { connect: { id: projectId } },
    },
    update: {},
  });
};

const createIssueIfNotExists = async (issue: Issue, categoryId: CategoryId): Promise<IssueDB> => {
  const startDate = issue.startDate ? new Date(issue.startDate) : undefined;
  const endDate = issue.endDate ? new Date(issue.endDate) : undefined;

  return db.issue.upsert({
    where: { id: issue.id },
    create: {
      id: issue.id,
      name: issue.name,
      description: issue.description,
      category: { connect: { id: categoryId } },
      asignee: { connect: { id: issue.asignee.id } },
      reporter: { connect: { id: issue.reporter.id } },
      priority: { connect: { id: issue.priority.id } },
      startDate,
      endDate,
      comments: {
        create: issue.comments.map((comment) => ({
          id: comment.id,
          message: comment.message,
          user: { connect: { id: comment.user.id } },
        })),
      },
    },
    update: {
      startDate,
      endDate,
    },
  });
};

const seedUsers = async () => {
  for (const user of usersMock) {
    const userDb = await createUserIfNotExists(user);
    if (recordAlreadyExists(userDb)) {
      console.info(`User already exists: ${user.name}. Skipping...`);
    } else {
      console.info(`Created USER: ${user.name}`);
    }
  }
};

const seedPriorities = async () => {
  for (const priority of prioritiesMock) {
    const priorityDb = await createPriorityIfNotExists(priority);
    if (recordAlreadyExists(priorityDb)) {
      console.info(`Priority already exists: ${priority.name}. Skipping...`);
    } else {
      console.info(`Created PRIORITY: ${priority.name}`);
    }
  }
};

const seedProjects = async () => {
  for (const project of projectsMock) {
    const projectDb = await createProjectIfNotExists(project);
    const projectExisted = recordAlreadyExists(projectDb);

    if (projectExisted) {
      console.info(`Project already exists: ${project.name}. Updating issue dates...`);
    } else {
      console.info(`Created PROJECT: ${project.name}`);
    }

    for (const category of project.categories) {
      const categoryDb = await createCategoryIfNotExists(category, projectDb.id);
      if (!projectExisted && !recordAlreadyExists(categoryDb)) {
        console.info(`Created CATEGORY: ${category.name}`);
      }

      for (const issue of category.issues) {
        const issueDb = await createIssueIfNotExists(issue, categoryDb.id);
        if (recordAlreadyExists(issueDb)) {
          console.info(`Updated ISSUE dates: ${issue.name}`);
        } else {
          console.info(`Created ISSUE: ${issue.name}`);
        }
      }
    }
  }
};

const seedDb = async () => {
  await seedUsers();
  await seedPriorities();
  await seedProjects();
};

type GenericRecord = {
  createdAt: Date;
  updatedAt: Date;
};
const recordAlreadyExists = (record: GenericRecord): boolean => {
  // If the time difference between createdAt and updatedAt is less than 100ms,
  // then we consider the record was just created. Otherwise, it was updated.
  const TIME_DIFFERENCE_THRESHOLD_MILISECONDS = 1000;
  const timeDifference = Date.now() - record.createdAt.getTime();
  return timeDifference > TIME_DIFFERENCE_THRESHOLD_MILISECONDS;
};

seedDb();
