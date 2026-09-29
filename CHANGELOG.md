# Changelog

Plain-language log of what changed in this project, day by day. Kept by the
docs-sync automation — each entry covers what merged (or opened as a PR) since
the previous entry, plus any docs correction that entry's run made.

## 2026-09-29

- Docs sync: corrected `README.md`, which still described the app as built
  with "Remix Run" throughout. The app runs on **React Router v7** (framework
  mode, SSR) — `remix` was dropped from `package.json` and the config lives in
  `react-router.config.ts`. Updated every Remix reference, corrected the
  theme count (README said 6; there are 5 palettes — Light, Dark, Lava, Lime,
  Barbie — plus a "System" option that just follows the OS preference rather
  than being its own palette), and updated the Test section (`npm run test`
  runs Playwright, not a generic runner; `npm run test-coverage` runs the
  Vitest unit tests separately).
- Recent activity this log did not yet cover (for context, not verified
  against the live app since some are still open pull requests):
  - `#89` — perf: trim the dev-mode request chain for a faster Studio preview
    (open).
  - `#88` — add a "Quick filters" bar to the board (My issues / High
    priority toggles) (open).
  - `#87` — add comment replies and @mentions in the issue panel (open).
