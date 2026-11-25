// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseSort } from "./filter";

describe("parseSort", () => {
  it("reads a known sort written in lower case", () => {
    expect(parseSort("date")).toBe("date");
    expect(parseSort("priority")).toBe("priority");
  });

  it("ignores letter case", () => {
    expect(parseSort("Date")).toBe("date");
    expect(parseSort("DATE")).toBe("date");
    expect(parseSort("Priority")).toBe("priority");
    expect(parseSort("PRIORITY")).toBe("priority");
    expect(parseSort("pRiOrItY")).toBe("priority");
  });

  it("ignores anything that is not a known sort", () => {
    expect(parseSort("")).toBeNull();
    expect(parseSort(" ")).toBeNull();
    expect(parseSort("createdAt")).toBeNull();
    expect(parseSort("PRIORITIES")).toBeNull();
    expect(parseSort(null)).toBeNull();
  });
});
