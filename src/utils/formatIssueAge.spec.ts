import { describe, expect, it } from "vitest";
import { formatIssueAge } from "./formatIssueAge";

const NOW = new Date("2024-06-15T12:00:00Z").getTime();
const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

const ageOfIssueCreated = (elapsed: number): string =>
  formatIssueAge(NOW - elapsed, NOW);

describe("formatIssueAge", () => {
  describe("today", () => {
    it("labels an issue created just now as 'today'", () => {
      expect(ageOfIssueCreated(0)).toBe("today");
    });

    it("labels an issue created a few hours ago as 'today'", () => {
      expect(ageOfIssueCreated(5 * HOUR_IN_MS)).toBe("today");
    });

    it("labels an issue one millisecond under a day as 'today'", () => {
      expect(ageOfIssueCreated(DAY_IN_MS - 1)).toBe("today");
    });

    it("labels an issue created in the future as 'today'", () => {
      expect(formatIssueAge(NOW + DAY_IN_MS, NOW)).toBe("today");
    });
  });

  describe("days", () => {
    it("labels an issue exactly one day old as '1d'", () => {
      expect(ageOfIssueCreated(DAY_IN_MS)).toBe("1d");
    });

    it("labels an issue three days old as '3d'", () => {
      expect(ageOfIssueCreated(3 * DAY_IN_MS)).toBe("3d");
    });

    it("floors a partial day down to whole days", () => {
      expect(ageOfIssueCreated(3 * DAY_IN_MS + 23 * HOUR_IN_MS)).toBe("3d");
    });

    it("labels an issue one millisecond under a week as '6d'", () => {
      expect(ageOfIssueCreated(7 * DAY_IN_MS - 1)).toBe("6d");
    });
  });

  describe("weeks", () => {
    it("labels an issue exactly one week old as '1w'", () => {
      expect(ageOfIssueCreated(7 * DAY_IN_MS)).toBe("1w");
    });

    it("labels an issue two weeks old as '2w'", () => {
      expect(ageOfIssueCreated(14 * DAY_IN_MS)).toBe("2w");
    });

    it("floors a partial week down to whole weeks", () => {
      expect(ageOfIssueCreated(20 * DAY_IN_MS)).toBe("2w");
    });

    it("labels an issue one millisecond under three weeks as '2w'", () => {
      expect(ageOfIssueCreated(21 * DAY_IN_MS - 1)).toBe("2w");
    });

    it("labels an issue three weeks old as '3w'", () => {
      expect(ageOfIssueCreated(21 * DAY_IN_MS)).toBe("3w");
    });
  });
});
