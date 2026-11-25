import { describe, expect, it } from "vitest";
import { parseSort } from "./filter";

describe("parseSort", () => {
  it("returns known sorts in their canonical form", () => {
    expect(parseSort("date")).toBe("date");
    expect(parseSort("priority")).toBe("priority");
  });

  it("ignores letter case", () => {
    expect(parseSort("Priority")).toBe("priority");
    expect(parseSort("PRIORITY")).toBe("priority");
    expect(parseSort("pRiOrItY")).toBe("priority");
    expect(parseSort("Date")).toBe("date");
    expect(parseSort("DATE")).toBe("date");
  });

  it("ignores anything that is not a known sort, in any case", () => {
    expect(parseSort(null)).toBeNull();
    expect(parseSort("")).toBeNull();
    expect(parseSort("createdAt")).toBeNull();
    expect(parseSort("priority;drop")).toBeNull();
    expect(parseSort("1234")).toBeNull();
  });
});
