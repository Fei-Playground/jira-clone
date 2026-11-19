import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a timestamp as short month, numeric day and numeric year", () => {
    expect(formatDate(new Date(2026, 10, 3).valueOf())).toBe("Nov 3, 2026");
  });

  it("does not pad a single digit day", () => {
    expect(formatDate(new Date(2026, 0, 8).valueOf())).toBe("Jan 8, 2026");
  });

  it("keeps the year explicit", () => {
    expect(formatDate(new Date(2022, 0, 18).valueOf())).toBe("Jan 18, 2022");
  });
});
