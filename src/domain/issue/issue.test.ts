// @vitest-environment node
import { describe, expect, it } from "vitest";
import { normalizeLabel, normalizeLabels, parseLabels } from "./issue";

describe("normalizeLabel", () => {
  it("trims the spaces around a label", () => {
    expect(normalizeLabel("  bug  ")).toBe("bug");
    expect(normalizeLabel(" a ")).toBe("a");
  });

  it("reads an empty label as no label", () => {
    expect(normalizeLabel("")).toBeNull();
  });

  it("reads a spaces-only label as no label", () => {
    expect(normalizeLabel("   ")).toBeNull();
  });
});

describe("normalizeLabels", () => {
  it("trims every label, drops the empty ones and removes duplicates", () => {
    expect(normalizeLabels(["  bug  ", "bug", "", "   ", "ui"])).toEqual(["bug", "ui"]);
  });

  it("reads a value that is not an array as no labels", () => {
    expect(normalizeLabels(undefined)).toEqual([]);
    expect(normalizeLabels("bug")).toEqual([]);
  });

  it("drops the entries that are not strings", () => {
    expect(normalizeLabels(["bug", 42, null, { name: "ui" }])).toEqual(["bug"]);
  });
});

describe("parseLabels", () => {
  it("reads the JSON array the issue form sends", () => {
    expect(parseLabels(JSON.stringify(["  bug  ", "bug", "   "]))).toEqual(["bug"]);
  });

  it("reads a value that is not a string as no labels, even one that stringifies to JSON", () => {
    expect(parseLabels(['["bug"]'])).toEqual([]);
  });

  it("reads a missing or empty value as no labels", () => {
    expect(parseLabels(null)).toEqual([]);
    expect(parseLabels(undefined)).toEqual([]);
    expect(parseLabels("")).toEqual([]);
  });

  it("reads a malformed value as no labels instead of throwing", () => {
    expect(parseLabels("[not json")).toEqual([]);
  });
});
