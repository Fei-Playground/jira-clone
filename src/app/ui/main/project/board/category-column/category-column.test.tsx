import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { CategoryColumn } from "./category-column";

const category = projectMock1.categories[0];
const issue = category.issues[0];

const boardPath = "/projects/jira-clone/board";

const renderColumn = (search: string): void => {
  const router = createMemoryRouter(
    [
      {
        path: "/projects/:projectId/board",
        element: (
          <DndProvider backend={HTML5Backend}>
            <ProjectContextProvider project={projectMock1}>
              <CategoryColumn
                category={category}
                isDragging={false}
                submittingIssues={[]}
                setSubmittingIssues={() => {}}
                handleDragging={() => {}}
              />
            </ProjectContextProvider>
          </DndProvider>
        ),
      },
    ],
    { initialEntries: [`${boardPath}${search}`] }
  );

  render(<RouterProvider router={router} />);
};

const issueCardHref = (): string | null =>
  screen.getByText(issue.name).closest("a")?.getAttribute("href") ?? null;

const newIssueHref = (): string | null =>
  screen.getByLabelText(`Add new ${category.name} issue`).getAttribute("href");

afterEach(cleanup);

describe("board issue links", () => {
  it.each([
    "?sortBy=priority",
    "?sortBy=Priority",
    "?sortBy=PRIORITY",
    "?sortBy=pRiOrItY",
  ])("carry the canonical sort into the issue links for %s", (search) => {
    renderColumn(search);

    expect(issueCardHref()).toBe(
      `${boardPath}/issue/${issue.id}?sortBy=priority`
    );
    expect(newIssueHref()).toBe(
      `${boardPath}/issue/new?category=${category.type}&sortBy=priority`
    );
  });

  it.each(["?sortBy=bogus", "?sortBy=", ""])(
    "carry no sort into the issue links for %s",
    (search) => {
      renderColumn(search);

      expect(issueCardHref()).toBe(`${boardPath}/issue/${issue.id}`);
      expect(newIssueHref()).toBe(
        `${boardPath}/issue/new?category=${category.type}`
      );
    }
  );
});
