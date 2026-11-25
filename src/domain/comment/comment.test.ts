import { describe, expect, it } from "vitest";
import { commentMock1, commentMock2, commentMock3 } from "./comment.mock";
import { Comment, normalizeComments } from "./comment";

describe("normalizeComments", () => {
  it("trims the surrounding whitespace off every comment message", () => {
    const comments: Comment[] = [
      { ...commentMock1, message: "   Studio check   " },
      { ...commentMock2, message: "\tStudio check\n" },
    ];

    expect(normalizeComments(comments)).toEqual([
      { ...commentMock1, message: "Studio check" },
      { ...commentMock2, message: "Studio check" },
    ]);
  });

  it("drops every comment left empty by the trim", () => {
    const comments: Comment[] = [
      { ...commentMock1, message: "   " },
      { ...commentMock2, message: "\t\n " },
      { ...commentMock3, message: "Studio check" },
    ];

    expect(normalizeComments(comments)).toEqual([{ ...commentMock3, message: "Studio check" }]);
  });

  it("keeps a message that has no padding exactly as it is, even a single character", () => {
    const comments: Comment[] = [
      { ...commentMock1, message: "Studio check" },
      { ...commentMock2, message: "a" },
    ];

    expect(normalizeComments(comments)).toEqual([
      { ...commentMock1, message: "Studio check" },
      { ...commentMock2, message: "a" },
    ]);
  });
});
