// @vitest-environment node
import { describe, expect, it } from "vitest";
import playwrightConfig from "../playwright.config";

/**
 * The vitest suites sit beside the source under `src/app` and are named
 * `*.test.*`, so the Playwright run has to collect the specs only. This is the
 * config the run reads, so the two runners stay disjoint.
 */
describe("playwright config", () => {
  it("collects only the *.spec.* files under the app directory", () => {
    expect(playwrightConfig.testDir).toBe("./src/app");
    expect(playwrightConfig.testMatch).toBe("**/*.spec.{ts,tsx}");
  });
});
