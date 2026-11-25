// @vitest-environment node
import "./board/test-db";
import { describe, expect, it } from "vitest";
import type { Project } from "@domain/project";
import { loader } from "./board";

const PROJECT_ID = "second-project";

/**
 * The TODO column of `second-project` is the only seeded column whose date
 * order differs from its priority order, so it is the one that tells the two
 * sorts apart.
 */
const PRIORITY_ORDER = [
  "Add and display issue timestamps",
  "Add projects section and the ability to create multiple projects",
];
const DATE_ORDER = [
  "Add projects section and the ability to create multiple projects",
  "Add and display issue timestamps",
];

type LoaderArgs = { request: Request; params: Record<string, string> };
type BoardLoader = (args: LoaderArgs) => Promise<{ data: { project: Project } }>;

const loadTodoIssues = async (search: string): Promise<string[]> => {
  const result = await (loader as unknown as BoardLoader)({
    request: new Request(`http://localhost/projects/${PROJECT_ID}/board${search}`),
    params: { projectId: PROJECT_ID },
  });

  const todo = result.data.project.categories.find((category) => category.type === "TODO");

  return todo?.issues.map((issue) => issue.name) ?? [];
};

describe("board loader: the sortBy search param", () => {
  it.each(["priority", "Priority", "PRIORITY", "pRiOrItY"])(
    "sorts by priority for ?sortBy=%s",
    async (sortBy) => {
      expect(await loadTodoIssues(`?sortBy=${sortBy}`)).toEqual(PRIORITY_ORDER);
    }
  );

  it.each(["date", "Date", "DATE"])("sorts by date for ?sortBy=%s", async (sortBy) => {
    expect(await loadTodoIssues(`?sortBy=${sortBy}`)).toEqual(DATE_ORDER);
  });

  it.each([
    { search: "?sortBy=bogus", why: "a value that is not a sort" },
    { search: "?sortBy=PRIORITIES", why: "a plural that is not a sort" },
    { search: "?sortBy=NAME", why: "an upper case value that is not a sort" },
    { search: "?sortBy=", why: "an empty value" },
    { search: "", why: "no sortBy param at all" },
  ])("falls back to the default date sort for $search ($why)", async ({ search }) => {
    expect(await loadTodoIssues(search)).toEqual(DATE_ORDER);
  });
});
