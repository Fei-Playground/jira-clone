// @vitest-environment node
import { describe, expect, it } from "vitest";
import { compareTitles, parseSort, sortList } from "./filter";

describe("parseSort", () => {
  it("reads a known sort written in lower case", () => {
    expect(parseSort("date")).toBe("date");
    expect(parseSort("priority")).toBe("priority");
    expect(parseSort("title")).toBe("title");
  });

  it("ignores letter case", () => {
    expect(parseSort("Date")).toBe("date");
    expect(parseSort("DATE")).toBe("date");
    expect(parseSort("Priority")).toBe("priority");
    expect(parseSort("PRIORITY")).toBe("priority");
    expect(parseSort("pRiOrItY")).toBe("priority");
    expect(parseSort("Title")).toBe("title");
    expect(parseSort("TITLE")).toBe("title");
  });

  it("ignores anything that is not a known sort", () => {
    expect(parseSort("")).toBeNull();
    expect(parseSort(" ")).toBeNull();
    expect(parseSort("createdAt")).toBeNull();
    expect(parseSort("PRIORITIES")).toBeNull();
    expect(parseSort("titles")).toBeNull();
    expect(parseSort(null)).toBeNull();
  });
});

describe("sortList", () => {
  it("offers date, priority and title, in that order", () => {
    expect(sortList).toEqual([
      { id: "date", label: "Date" },
      { id: "priority", label: "Priority" },
      { id: "title", label: "Title" },
    ]);
  });
});

describe("compareTitles", () => {
  it("orders titles A to Z ignoring letter case", () => {
    expect(["pear", "Apple", "banana"].sort(compareTitles)).toEqual(["Apple", "banana", "pear"]);
    expect(compareTitles("apple", "Banana")).toBeLessThan(0);
    expect(compareTitles("Banana", "apple")).toBeGreaterThan(0);
  });

  it("treats titles that differ only in letter case as equal", () => {
    expect(compareTitles("Cherry", "cherry")).toBe(0);
  });
});
