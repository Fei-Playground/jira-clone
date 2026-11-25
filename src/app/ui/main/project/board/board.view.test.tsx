// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

/**
 * The sort control opens on a pointer press and reads the pointer capture API,
 * which jsdom does not implement. These stand-ins let it open; they carry none
 * of the sort behaviour.
 */
HTMLElement.prototype.hasPointerCapture = () => false;
HTMLElement.prototype.setPointerCapture = () => undefined;
HTMLElement.prototype.releasePointerCapture = () => undefined;
HTMLElement.prototype.scrollIntoView = () => undefined;

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

const openSortControl = async (search: string): Promise<HTMLElement[]> => {
  renderBoard(search);
  await userEvent.click(screen.getByLabelText("Open sort issues select"));

  return screen.getAllByRole("option");
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

  it("opens onto the three sorts, each with its own icon, with the current one selected", async () => {
    const options = await openSortControl("?sortBy=title");

    expect(options.map((option) => option.textContent)).toEqual([
      "Date",
      "Priority",
      "Title",
    ]);

    const icons = options.map(
      (option) => option.querySelector("svg")?.outerHTML
    );

    expect(icons).not.toContain(undefined);
    expect(new Set(icons).size).toBe(3);

    expect(options[2].getAttribute("data-state")).toBe("checked");
    expect(options[0].getAttribute("data-state")).toBe("unchecked");
  });

  it("submits the sort picked in the control", async () => {
    renderBoard("?sortBy=date");
    await userEvent.click(screen.getByLabelText("Open sort issues select"));
    await userEvent.click(screen.getByRole("option", { name: "Priority" }));

    expect(screen.getByLabelText("Open sort issues select").textContent).toBe(
      "Sort by priority"
    );
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
