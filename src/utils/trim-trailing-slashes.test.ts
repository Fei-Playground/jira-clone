// @vitest-environment node
import { describe, it, expect } from "vitest";

import { trimTrailingSlashes } from "./trim-trailing-slashes";

describe("trimTrailingSlashes", () => {
  it("removes a single trailing slash", () => {
    expect(trimTrailingSlashes("/projects/123/")).toBe("/projects/123");
  });

  it("removes multiple trailing slashes", () => {
    expect(trimTrailingSlashes("/projects/123///")).toBe("/projects/123");
  });

  it("leaves a path without trailing slashes untouched", () => {
    expect(trimTrailingSlashes("/projects/123")).toBe("/projects/123");
  });

  it("keeps the root path as-is", () => {
    expect(trimTrailingSlashes("/")).toBe("/");
  });

  it("returns an empty string unchanged", () => {
    expect(trimTrailingSlashes("")).toBe("");
  });
});
