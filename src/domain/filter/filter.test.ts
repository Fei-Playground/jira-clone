import { describe, expect, it } from "vitest";
import { parseSort } from "./filter";

describe("parseSort", () => {
  it("reads a known sort whatever the letter case of the URL value", () => {
    expect(parseSort("date")).toBe("date");
    expect(parseSort("Date")).toBe("date");
    expect(parseSort("DATE")).toBe("date");
    expect(parseSort("dAtE")).toBe("date");
    expect(parseSort("priority")).toBe("priority");
    expect(parseSort("Priority")).toBe("priority");
    expect(parseSort("PRIORITY")).toBe("priority");
    expect(parseSort("pRiOrItY")).toBe("priority");
  });

  it("ignores a value that is not a known sort, in any casing", () => {
    expect(parseSort(null)).toBeNull();
    expect(parseSort("")).toBeNull();
    expect(parseSort("bogus")).toBeNull();
    expect(parseSort("BOGUS")).toBeNull();
    expect(parseSort("dates")).toBeNull();
    expect(parseSort("priorities")).toBeNull();
    expect(parseSort(" date ")).toBeNull();
  });
});
