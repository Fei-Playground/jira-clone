/**
 * The board's order comes from the route loader, so these tests drive the board
 * route the way a page load does instead of calling the sort helper alone.
 *
 * This file sits outside `src/app` because that is Playwright's testDir, whose
 * default testMatch would also collect a `*.test.tsx` file there.
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import type { ActionFunction } from "react-router";

// The board is asserted against the seeded sqlite file the app ships with, so
// the database is chosen before the route modules import the Prisma client.
// This is the same default db.server.ts falls back to.
process.env.DATABASE_URL = "file:./data.db?connection_limit=1";

const { default: BoardRoute, loader: boardLoader } =
  await import("@app/routes/__main/projects.$projectId/board");
const { action: createIssueAction } =
  await import("@app/routes/__main/projects.$projectId/board/issue/new");
const { action: editIssueAction } =
  await import("@app/routes/__main/projects.$projectId/board/issue/$issueId");

// jsdom has no EventSource, which the board only uses to refresh on server events.
class EventSourceStub {
  addEventListener(): void {
    // no server events are sent during these tests
  }

  removeEventListener(): void {
    // no server events are sent during these tests
  }

  close(): void {
    // no server events are sent during these tests
  }
}

globalThis.EventSource = EventSourceStub as unknown as typeof EventSource;

const ORIGIN = "http://localhost";
const PROJECT_ID = "second-project";
const BOARD_URL = `/projects/${PROJECT_ID}/board`;
// The two issues in the seeded project's "To do" column: sorting by priority
// puts the first one first, sorting by date puts the second one first.
const FIRST_BY_PRIORITY = "Add and display issue timestamps";
const FIRST_BY_PRIORITY_ID = "f3efefcf-7859-4241-8b03-4ae815183355";
const FIRST_BY_DATE =
  "Add projects section and the ability to create multiple projects";
const FIRST_BY_DATE_ID = "6bf6a1f4-20bb-492b-8ea4-4aa18efeb062";

const renderBoard = (search = ""): void => {
  const Stub = createRoutesStub([
    {
      path: "/projects/:projectId/board",
      Component: BoardRoute,
      loader: boardLoader,
    },
  ]);

  render(<Stub initialEntries={[`${BOARD_URL}${search}`]} />);
};

/**
 * The two seeded "To do" issues, in the order the column renders them. Issues
 * added to the seeded board later do not change their order relative to
 * each other, so only these two are compared.
 */
const todoIssueOrder = (): string[] => {
  const column = screen.getByText("To do").closest("div")?.parentElement;
  const issueNames = Array.from(column?.querySelectorAll("li p") ?? []).map(
    (issue) => issue.textContent ?? ""
  );

  return issueNames.filter(
    (name) => name === FIRST_BY_PRIORITY || name === FIRST_BY_DATE
  );
};

const issueLinkHref = async (issueName: string): Promise<string> => {
  const link = await screen.findByRole("link", { name: new RegExp(issueName) });

  return link.getAttribute("href") ?? "";
};

const newIssueLinkHref = async (categoryName: string): Promise<string> => {
  const link = await screen.findByRole("link", {
    name: `Add new ${categoryName} issue`,
  });

  return link.getAttribute("href") ?? "";
};

/**
 * Calls a route action with an `_action` none of its branches handles, so the
 * board URL it redirects to is built from `sortBy` without writing an issue.
 * The route pattern is only part of the action args, not read by the actions.
 */
const actionLocation = async (
  action: ActionFunction,
  url: string
): Promise<string | null> => {
  const location = `${ORIGIN}${url}`;
  const result = await action({
    request: new Request(location, {
      method: "POST",
      body: new URLSearchParams({ _action: "no-op" }),
    }),
    params: { projectId: PROJECT_ID, issueId: FIRST_BY_PRIORITY_ID },
    context: {},
    unstable_url: new URL(location),
    unstable_pattern: new URL(location).pathname,
  });

  if (!(result instanceof Response)) {
    throw new Error("the route action did not return a response");
  }

  return result.headers.get("Location");
};

describe("the board sorts by the sortBy value of the URL", () => {
  it.each(["priority", "Priority", "PRIORITY"])(
    "sorts by priority for ?sortBy=%s",
    async (sortBy) => {
      renderBoard(`?sortBy=${sortBy}`);
      await screen.findByText(FIRST_BY_PRIORITY);

      expect(todoIssueOrder()).toEqual([FIRST_BY_PRIORITY, FIRST_BY_DATE]);
    }
  );

  it.each(["date", "Date", "DATE"])(
    "sorts by date for ?sortBy=%s",
    async (sortBy) => {
      renderBoard(`?sortBy=${sortBy}`);
      await screen.findByText(FIRST_BY_DATE);

      expect(todoIssueOrder()).toEqual([FIRST_BY_DATE, FIRST_BY_PRIORITY]);
    }
  );

  it.each(["bogus", "BOGUS", "dates", ""])(
    "ignores ?sortBy=%s and sorts by date",
    async (sortBy) => {
      renderBoard(`?sortBy=${sortBy}`);
      await screen.findByText(FIRST_BY_DATE);

      expect(todoIssueOrder()).toEqual([FIRST_BY_DATE, FIRST_BY_PRIORITY]);
    }
  );

  it("sorts by date when the URL carries no sortBy at all", async () => {
    renderBoard();
    await screen.findByText(FIRST_BY_DATE);

    expect(todoIssueOrder()).toEqual([FIRST_BY_DATE, FIRST_BY_PRIORITY]);
    expect(screen.getByText("Sort by date")).toBeTruthy();
  });
});

describe("the board labels the sort control and links the issues with the canonical sort", () => {
  it("shows and links the priority sort for ?sortBy=PRIORITY", async () => {
    renderBoard("?sortBy=PRIORITY");

    expect(await screen.findByText("Sort by priority")).toBeTruthy();
    expect(await issueLinkHref(FIRST_BY_PRIORITY)).toBe(
      `${BOARD_URL}/issue/${FIRST_BY_PRIORITY_ID}?sortBy=priority`
    );
    expect(await newIssueLinkHref("To do")).toBe(
      `${BOARD_URL}/issue/new?category=TODO&sortBy=priority`
    );
  });

  it("links the date sort for ?sortBy=DATE", async () => {
    renderBoard("?sortBy=DATE");

    expect(await screen.findByText("Sort by date")).toBeTruthy();
    expect(await issueLinkHref(FIRST_BY_DATE)).toBe(
      `${BOARD_URL}/issue/${FIRST_BY_DATE_ID}?sortBy=date`
    );
  });

  it("links the issues without a sort when the URL carries none", async () => {
    renderBoard();

    expect(await issueLinkHref(FIRST_BY_DATE)).toBe(
      `${BOARD_URL}/issue/${FIRST_BY_DATE_ID}`
    );
    expect(await newIssueLinkHref("To do")).toBe(
      `${BOARD_URL}/issue/new?category=TODO`
    );
  });
});

describe("creating and editing an issue keeps the board's sort", () => {
  it("sends you back to the board with the sort of the create issue URL", async () => {
    expect(
      await actionLocation(
        createIssueAction,
        `/projects/${PROJECT_ID}/board/issue/new?sortBy=PRIORITY`
      )
    ).toBe(`${BOARD_URL}?sortBy=priority`);

    expect(
      await actionLocation(
        createIssueAction,
        `/projects/${PROJECT_ID}/board/issue/new`
      )
    ).toBe(BOARD_URL);
  });

  it("sends you back to the board with the sort of the edit issue URL", async () => {
    expect(
      await actionLocation(
        editIssueAction,
        `/projects/${PROJECT_ID}/board/issue/${FIRST_BY_PRIORITY_ID}?sortBy=DATE`
      )
    ).toBe(`${BOARD_URL}?sortBy=date`);

    expect(
      await actionLocation(
        editIssueAction,
        `/projects/${PROJECT_ID}/board/issue/${FIRST_BY_PRIORITY_ID}`
      )
    ).toBe(BOARD_URL);
  });
});
