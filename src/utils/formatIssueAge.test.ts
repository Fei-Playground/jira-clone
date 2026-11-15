import { describe, expect, test } from "vitest";
import { formatIssueAge } from "./formatIssueAge";

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const NOW = new Date("2024-05-20T12:00:00.000Z").valueOf();

const ago = (days: number, hours = 0): number =>
  NOW - days * MS_PER_DAY - hours * MS_PER_HOUR;

describe("formatIssueAge", () => {
  describe("today", () => {
    test("renders 'today' for an issue created right now", () => {
      expect(formatIssueAge(NOW, NOW)).toBe("today");
    });

    test("renders 'today' for an issue created a few hours ago", () => {
      expect(formatIssueAge(ago(0, 5), NOW)).toBe("today");
    });

    test("renders 'today' up to the last hour of the first day", () => {
      expect(formatIssueAge(ago(0, 23), NOW)).toBe("today");
    });

    test("renders 'today' for a timestamp in the future", () => {
      expect(formatIssueAge(NOW + MS_PER_DAY, NOW)).toBe("today");
    });
  });

  describe("days", () => {
    test("renders '1d' at exactly one day", () => {
      expect(formatIssueAge(ago(1), NOW)).toBe("1d");
    });

    test("renders '3d' for three days", () => {
      expect(formatIssueAge(ago(3), NOW)).toBe("3d");
    });

    test("renders '6d' at the last hour of the sixth day", () => {
      expect(formatIssueAge(ago(6, 23), NOW)).toBe("6d");
    });
  });

  describe("weeks", () => {
    test("renders '1w' at exactly seven days", () => {
      expect(formatIssueAge(ago(7), NOW)).toBe("1w");
    });

    test("renders '1w' at the last hour of the first week", () => {
      expect(formatIssueAge(ago(13, 23), NOW)).toBe("1w");
    });

    test("renders '2w' for two weeks", () => {
      expect(formatIssueAge(ago(14), NOW)).toBe("2w");
    });

    test("renders '3w' for three weeks", () => {
      expect(formatIssueAge(ago(21), NOW)).toBe("3w");
    });
  });
});
