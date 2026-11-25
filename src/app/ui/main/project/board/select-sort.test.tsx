import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { SelectSort } from "./select-sort";

const renderSortControl = (search: string): string => {
  const router = createMemoryRouter(
    [{ path: "/projects/:projectId/board", element: <SelectSort /> }],
    { initialEntries: [`/projects/second-project/board${search}`] }
  );

  render(<RouterProvider router={router} />);

  return screen.getByRole("combobox").textContent ?? "";
};

afterEach(cleanup);

describe("board sort control", () => {
  it.each([
    { search: "?sortBy=priority", label: "Sort by priority" },
    { search: "?sortBy=Priority", label: "Sort by priority" },
    { search: "?sortBy=PRIORITY", label: "Sort by priority" },
    { search: "?sortBy=pRiOrItY", label: "Sort by priority" },
    { search: "?sortBy=date", label: "Sort by date" },
    { search: "?sortBy=Date", label: "Sort by date" },
    { search: "?sortBy=DATE", label: "Sort by date" },
  ])("labels the control $label for $search", ({ search, label }) => {
    expect(renderSortControl(search)).toBe(label);
  });

  it.each([
    { search: "?sortBy=bogus", why: "a value that is not a sort" },
    { search: "?sortBy=PRIORITIES", why: "a plural that is not a sort" },
    { search: "?sortBy=NAME", why: "an upper case value that is not a sort" },
    { search: "?sortBy=", why: "an empty value" },
    { search: "", why: "no sortBy param at all" },
  ])(
    "labels the control with the default date sort for $search ($why)",
    ({ search }) => {
      expect(renderSortControl(search)).toBe("Sort by date");
    }
  );
});
