import { describe, expect, test } from "vitest";
import { formatIssueAge, isIssueStale } from "./formatIssueAge";

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

    test("renders '7w' on the last day of the weeks tier", () => {
      expect(formatIssueAge(ago(55), NOW)).toBe("7w");
    });
  });

  describe("months", () => {
    test("renders '1mo' at exactly eight weeks", () => {
      expect(formatIssueAge(ago(56), NOW)).toBe("1mo");
    });

    test("renders '3mo' once three months have passed", () => {
      expect(formatIssueAge(ago(92), NOW)).toBe("3mo");
    });

    test("renders '11mo' on the last day of the months tier", () => {
      expect(formatIssueAge(ago(364), NOW)).toBe("11mo");
    });
  });

  describe("years", () => {
    test("renders '1y' at exactly one year", () => {
      expect(formatIssueAge(ago(365), NOW)).toBe("1y");
    });

    test("renders '2y' for two years", () => {
      expect(formatIssueAge(ago(730), NOW)).toBe("2y");
    });
  });
});

describe("isIssueStale", () => {
  test("is not stale for an issue created today", () => {
    expect(isIssueStale(NOW, NOW)).toBe(false);
  });

  test("is not stale on the last day before six months", () => {
    expect(isIssueStale(ago(182), NOW)).toBe(false);
  });

  test("is stale at six months", () => {
    expect(isIssueStale(ago(183), NOW)).toBe(true);
  });

  test("is stale for an issue a year old", () => {
    expect(isIssueStale(ago(365), NOW)).toBe(true);
  });

  test("is not stale for a timestamp in the future", () => {
    expect(isIssueStale(NOW + MS_PER_DAY, NOW)).toBe(false);
  });

  test("turns stale exactly when the label reaches six months", () => {
    expect(formatIssueAge(ago(182), NOW)).toBe("5mo");
    expect(isIssueStale(ago(182), NOW)).toBe(false);

    expect(formatIssueAge(ago(183), NOW)).toBe("6mo");
    expect(isIssueStale(ago(183), NOW)).toBe(true);
  });
});
