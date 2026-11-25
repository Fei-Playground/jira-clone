import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { describe, expect, it } from "vitest";
import { Issue, todoIssuesMock1 } from "@domain/issue";
import { Priority, prioritiesMock } from "@domain/priority";
import { projectMock1 } from "@domain/project";
import { withRemixStub } from "@app/stories/utils";
import { IssueCard } from "@app/ui/main/project/board/category-column/issue-card";
import { SelectPriority } from "@app/ui/main/project/board/issue-panel/select-priority";

// jsdom ships neither of these, and Radix needs both to mount the dropdown:
// the popper measures with a ResizeObserver and the selected option scrolls itself in.
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver =
  ResizeObserverStub as unknown as typeof ResizeObserver;
Element.prototype.scrollIntoView = (): void => {};

const categoryId = projectMock1.categories[0].id;

const issueWithPriority = (priority: Priority): Issue => ({
  ...todoIssuesMock1[0],
  id: `issue-${priority.id}`,
  priority,
});

const handleDragging = (): void => {};

describe("priority flag accessible name", () => {
  it("names each issue card's flag after the issue's own priority", () => {
    render(
      withRemixStub(
        <DndProvider backend={HTML5Backend}>
          {prioritiesMock.map((priority) => (
            <IssueCard
              key={priority.id}
              issue={issueWithPriority(priority)}
              categoryId={categoryId}
              isSubmitting={false}
              handleDragging={handleDragging}
            />
          ))}
        </DndProvider>
      )
    );

    expect(
      screen.getByRole("img", { name: "Priority: Low" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Priority: Medium" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Priority: High" })
    ).toBeInTheDocument();
    // The label is built from the priority name, never from its id.
    expect(
      screen.queryByRole("img", { name: "Priority: low" })
    ).not.toBeInTheDocument();
  });

  it("keeps the flag in the issue panel dropdown decorative", async () => {
    render(<SelectPriority initPriority="medium" />);

    const trigger = screen.getByRole("combobox", {
      name: "Open priority select",
    });
    expect(trigger).toHaveAccessibleName("Open priority select");

    const flag = trigger.querySelector("span");
    expect(flag).toHaveAttribute("aria-hidden", "true");
    expect(trigger.querySelector('[role="img"]')).toBeNull();

    fireEvent.click(trigger);

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveAccessibleName("low");
    expect(options[1]).toHaveAccessibleName("medium");
    expect(options[2]).toHaveAccessibleName("high");
  });
});
