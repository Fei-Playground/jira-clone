import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { withRemixStub } from "@app/stories/utils";
import { IssueCardContent } from "./issue-card";

// Every fixture string but `link` is rendered as text, so none of them may
// contain a digit: the zero-comment case is asserted as "the card shows no
// digit at all".
const renderIssueCard = (commentsCount: number) =>
  render(
    withRemixStub(
      <IssueCardContent
        link="/issue/1"
        name="Fix the board"
        priorityId="high"
        idPrefix="abcdef"
        commentsCount={commentsCount}
        isSubmitting={false}
      />
    )
  );

describe("IssueCardContent", () => {
  it("shows the comment count in plural form when the issue has several comments", () => {
    const { container } = renderIssueCard(2);

    expect(container.textContent).toContain("2 comments");
  });

  it("shows the comment count in singular form when the issue has one comment", () => {
    const { container } = renderIssueCard(1);

    expect(container.textContent).toContain("1 comment");
    expect(container.textContent).not.toContain("1 comments");
  });

  it("shows no comment count at all when the issue has no comments", () => {
    const { container } = renderIssueCard(0);

    expect(container.textContent).not.toMatch(/\d/);
    expect(container.textContent).not.toContain("comment");
    // The priority flag has no accessible text, so it is identified by the
    // accent class its priority maps to (high -> red).
    expect(container.querySelector("span.text-icon-accent-red")).toBeTruthy();
    expect(container.textContent).toContain("Fix the board");
  });
});
