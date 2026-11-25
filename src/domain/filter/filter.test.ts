// @vitest-environment node
import { describe, expect, it } from "vitest";
import { isValidSort, normalizeSort } from "./filter";

describe("normalizeSort", () => {
  it("resolves a known sort", () => {
    expect(normalizeSort("date")).toBe("date");
    expect(normalizeSort("priority")).toBe("priority");
  });

  it("resolves a known sort in any letter case", () => {
    expect(normalizeSort("DATE")).toBe("date");
    expect(normalizeSort("Date")).toBe("date");
    expect(normalizeSort("PRIORITY")).toBe("priority");
    expect(normalizeSort("Priority")).toBe("priority");
    expect(normalizeSort("pRiOrItY")).toBe("priority");
  });

  it("ignores a value that is not a known sort in any case", () => {
    expect(normalizeSort("")).toBeNull();
    expect(normalizeSort("name")).toBeNull();
    expect(normalizeSort("priorities")).toBeNull();
    expect(normalizeSort(" date")).toBeNull();
  });

  it("ignores a missing sortBy param", () => {
    expect(normalizeSort(null)).toBeNull();
  });
});

describe("isValidSort", () => {
  it("accepts only the exact known sorts", () => {
    expect(isValidSort("date")).toBe(true);
    expect(isValidSort("priority")).toBe(true);
    expect(isValidSort("PRIORITY")).toBe(false);
    expect(isValidSort("name")).toBe(false);
  });
});
