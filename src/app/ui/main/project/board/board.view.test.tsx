// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { BoardView } from "./board.view";

/**
 * jsdom has neither browser API the board subscribes to: the SSE stream it
 * listens on for issue changes and the ResizeObserver behind the scroll area.
 * Both stand-ins below are inert and carry none of the sort behaviour.
 */
class StubEventSource {
  addEventListener(): void {}
  removeEventListener(): void {}
  close(): void {}
}

globalThis.EventSource = StubEventSource as unknown as typeof EventSource;
globalThis.ResizeObserver = class {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
} as unknown as typeof ResizeObserver;

const todoIssue = todoIssuesMock1[0];

const renderBoard = (search: string): void => {
  cleanup();
  const Board = createRoutesStub([
    { path: "/", Component: () => <BoardView project={projectMock1} /> },
  ]);

  render(<Board initialEntries={[`/${search}`]} />);
};

const sortLabel = (search: string): string => {
  renderBoard(search);

  return screen.getByLabelText("Open sort issues select").textContent ?? "";
};

const boardLinks = (search: string): string[] => {
  renderBoard(search);

  return screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href") ?? "");
};

describe("board sortBy in the UI", () => {
  it("reads the sort control's label ignoring letter case", () => {
    expect(sortLabel("?sortBy=priority")).toBe("Sort by priority");
    expect(sortLabel("?sortBy=Priority")).toBe("Sort by priority");
    expect(sortLabel("?sortBy=PRIORITY")).toBe("Sort by priority");
    expect(sortLabel("?sortBy=date")).toBe("Sort by date");
    expect(sortLabel("?sortBy=Date")).toBe("Sort by date");
    expect(sortLabel("?sortBy=DATE")).toBe("Sort by date");
    expect(sortLabel("?sortBy=title")).toBe("Sort by title");
    expect(sortLabel("?sortBy=Title")).toBe("Sort by title");
    expect(sortLabel("?sortBy=TITLE")).toBe("Sort by title");
  });

  it("reads the date label for a sort it does not know", () => {
    expect(sortLabel("?sortBy=nope")).toBe("Sort by date");
    expect(sortLabel("?sortBy=PRIORITIES")).toBe("Sort by date");
    expect(sortLabel("?sortBy=")).toBe("Sort by date");
    expect(sortLabel("")).toBe("Sort by date");
  });

  it("keeps the canonical lower-case sortBy in the issue links", () => {
    const priorityLinks = boardLinks("?sortBy=PRIORITY");

    expect(priorityLinks).toContain(`/issue/${todoIssue.id}?sortBy=priority`);
    expect(priorityLinks).toContain("/issue/new?category=TODO&sortBy=priority");

    const dateLinks = boardLinks("?sortBy=Date");

    expect(dateLinks).toContain(`/issue/${todoIssue.id}?sortBy=date`);
    expect(dateLinks).toContain("/issue/new?category=TODO&sortBy=date");

    const titleLinks = boardLinks("?sortBy=TITLE");

    expect(titleLinks).toContain(`/issue/${todoIssue.id}?sortBy=title`);
    expect(titleLinks).toContain("/issue/new?category=TODO&sortBy=title");
  });

  it("drops a sort it does not know from the issue links", () => {
    const links = boardLinks("?sortBy=PRIORITIES");

    expect(links).toContain(`/issue/${todoIssue.id}`);
    expect(links).toContain("/issue/new?category=TODO");
    expect(links.filter((href) => href.includes("sortBy"))).toEqual([]);
  });
});
