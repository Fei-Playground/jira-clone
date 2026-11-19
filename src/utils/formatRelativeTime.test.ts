import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./formatRelativeTime";

const now = new Date(2026, 10, 19, 12, 0).valueOf();

const ago = (milliseconds: number) => formatRelativeTime(now - milliseconds, now);

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("formatRelativeTime", () => {
  it("reads as now under a minute", () => {
    expect(ago(30 * 1000)).toBe("now");
  });

  it("counts minutes", () => {
    expect(ago(5 * MINUTE)).toBe("5 minutes ago");
  });

  it("counts hours", () => {
    expect(ago(3 * HOUR)).toBe("3 hours ago");
  });

  it("counts days", () => {
    expect(ago(3 * DAY)).toBe("3 days ago");
  });

  it("names yesterday instead of one day ago", () => {
    expect(ago(DAY)).toBe("yesterday");
  });

  it("counts weeks", () => {
    expect(ago(14 * DAY)).toBe("2 weeks ago");
  });

  it("counts months", () => {
    expect(ago(30 * DAY * 7)).toBe("7 months ago");
  });

  it("counts years", () => {
    expect(ago(365 * DAY * 2)).toBe("2 years ago");
  });

  it("handles a timestamp in the future", () => {
    expect(formatRelativeTime(now + 3 * DAY, now)).toBe("in 3 days");
  });

  it("reads the current time on every call", () => {
    const createdAt = now;
    expect(formatRelativeTime(createdAt, now)).toBe("now");
    expect(formatRelativeTime(createdAt, now + 3 * DAY)).toBe("3 days ago");
  });
});
