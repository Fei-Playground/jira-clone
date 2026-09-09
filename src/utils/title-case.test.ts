import { describe, expect, it } from "vitest";
import { titleCase } from "./title-case";

describe("titleCase", () => {
  it("capitalizes the first letter of each word", () => {
    expect(titleCase("hello world")).toBe("Hello World");
  });

  it("lowercases the rest of each word", () => {
    expect(titleCase("hELLO wORLD")).toBe("Hello World");
  });

  it("handles a single word", () => {
    expect(titleCase("issue")).toBe("Issue");
  });

  it("handles an empty string", () => {
    expect(titleCase("")).toBe("");
  });
});
