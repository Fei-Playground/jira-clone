import { beforeAll, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Category, categoriesMock1 } from "@domain/category";
import { projectMock1 } from "@domain/project";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ProjectContextProvider } from "@app/ui/main/project";
import { CategoryColumn } from "./category-column";

// jsdom implements neither of these APIs: the theme provider calls
// `window.matchMedia` and the Radix scroll area calls `ResizeObserver`.
beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;

  globalThis.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;
});

/** Renders the real column with the same providers the app and its story use. */
const renderCategoryColumn = (category: Category) =>
  render(
    <DndProvider backend={HTML5Backend}>
      <ProjectContextProvider project={projectMock1}>
        {withRemixStub(
          withMainContext(() => (
            <CategoryColumn
              category={category}
              isDragging={false}
              submittingIssues={[]}
              setSubmittingIssues={() => {}}
              handleDragging={() => {}}
            />
          ))
        )}
      </ProjectContextProvider>
    </DndProvider>
  );

describe("CategoryColumn", () => {
  describe("issue count in the column header", () => {
    it("renders the number of issues next to the category name", () => {
      const category = projectMock1.categories[1]; // "In progress", 2 issues
      renderCategoryColumn(category);

      expect(category.issues).toHaveLength(2);
      expect(screen.getByText(category.name)).toBeDefined();
      expect(screen.getByText(`( ${category.issues.length} )`)).toBeDefined();
    });

    it("renders ( 0 ) next to the category name when the column has no issues", () => {
      const emptyCategory: Category = { ...categoriesMock1[0], issues: [] };
      renderCategoryColumn(emptyCategory);

      expect(screen.getByText(emptyCategory.name)).toBeDefined();
      expect(screen.getByText("( 0 )")).toBeDefined();
      expect(screen.getByText("No issues found")).toBeDefined();
    });

    it("shows a count that matches the issue cards rendered in the column", () => {
      const category = projectMock1.categories[1]; // "In progress", 2 issues
      renderCategoryColumn(category);

      const issueCards = within(screen.getByRole("list")).getAllByRole("link");
      const count = screen.getByText(`( ${issueCards.length} )`);

      expect(issueCards).toHaveLength(category.issues.length);
      expect(count.textContent).toBe(`( ${category.issues.length} )`);
    });
  });
});
