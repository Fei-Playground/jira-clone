import { describe, expect, it } from "vitest";

import { isValidSlug } from "./is-valid-slug";

describe("isValidSlug", () => {
  it("accepts lowercase letters, digits and hyphens", () => {
    expect(isValidSlug("hello-world-123")).toBe(true);
    expect(isValidSlug("abc")).toBe(true);
    expect(isValidSlug("123")).toBe(true);
    expect(isValidSlug("-leading-and-trailing-")).toBe(true);
  });

  it("rejects invalid slugs", () => {
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("Hello-World")).toBe(false);
    expect(isValidSlug("hello world")).toBe(false);
    expect(isValidSlug("hello_world")).toBe(false);
    expect(isValidSlug("hello.world")).toBe(false);
  });
});
